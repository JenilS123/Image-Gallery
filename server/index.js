const express = require("express");
const cors = require("cors");
require("dotenv").config();
require("./db/connection");
const UserModel = require("./models/User");
const PlaceModel = require("./models/Place");
const Booking = require("./models/Booking");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const imageDownloaded = require("image-downloader");
const multer = require("multer");
const fs = require("fs");
const app = express();

const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = "wuerjehgfjdkjfsdhffvncxdzcmflkgjlfdklsflgt";

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);
app.use("/uploads", express.static(__dirname + "/uploads"));
app.use(express.json());
app.use(cookieParser());

app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    let user = await UserModel.findOne({ email });
    if (user) {
      res.status(400).json({ message: "User Already Exits" });
    }

    user = await UserModel.create({
      name,
      email,
      password: bcrypt.hashSync(password, bcryptSalt),
    });
    if (user) {
      res.status(201).json(user);
    } else {
      console.log("database error");
    }
  } catch (error) {
    res.status(422).json({ message: "Something Went Wrong" });
    console.log("register error: ", error);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (user) {
      const passok = bcrypt.compareSync(password, user.password);

      if (passok) {
        jwt.sign(
          { id: user._id, email: user.email },
          jwtSecret,
          {},
          (err, token) => {
            if (err) {
              console.log("jwt error: ", err);
            }
            res.status(200).cookie("jwtToken", token).json(user);
          }
        );
      } else {
        res.status(422).json("password not found");
      }
    } else {
      res.status(422).json("email not found");
    }
  } catch (error) {
    console.log("login Error: " + error);
  }
});

app.get("/profile", (req, res) => {
  try {
    const { jwtToken } = req.cookies;
    if (jwtToken) {
      jwt.verify(jwtToken, jwtSecret, {}, async (err, userData) => {
        if (err) throw err;
        const { name, email, _id } = await UserModel.findById(userData.id);
        res.json({ name, email, _id });
      });
    } else {
      res.status(422).json(null);
    }
  } catch (error) {
    console.log("profile error" + error);
  }
});

app.post("/logout", (req, res) => {
  res.cookie("jwtToken", "").json(true);
});

app.post("/upload-by-link", async (req, res) => {
  try {
    const { link } = req.body;
    const newName = "photo" + Date.now() + ".jpg";
    await imageDownloaded.image({
      url: link,
      dest: __dirname + "/uploads/" + newName,
    });
    res.json(newName);
  } catch (error) {
    console.log("upload-by-link " + error);
  }
});

const photoMiddleWare = multer({ dest: "uploads/" });

app.post("/upload", photoMiddleWare.array("photos", 100), (req, res) => {
  try {
    const uploadfiles = [];
    for (let i = 0; i < req.files.length; i++) {
      const { originalname, path } = req.files[i];
      const parts = originalname.split(".");
      const ext = parts[parts.length - 1];
      const newPath = path + "." + ext;
      fs.renameSync(path, newPath);
      uploadfiles.push(newPath.replace("uploads\\", ""));
    }
    res.json(uploadfiles);
  } catch (error) {
    console.log("upload error " + error);
  }
});

app.post("/places", (req, res) => {
  try {
    const { jwtToken } = req.cookies;
    const {
      title,
      address,
      addedPhotos,
      description,
      maxImg,
      price,
    } = req.body;

    jwt.verify(jwtToken, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      const placeDoc = await PlaceModel.create({
        owner: userData.id,
        title,
        address,
        photos: addedPhotos,
        description,
        maxImg,
        price,
      });
      res.json(placeDoc);
    });
  } catch (error) {
    console.log("places error " + error);
  }
});

app.get("/user-places", (req, res) => {
  try {
    const { jwtToken } = req.cookies;
    jwt.verify(jwtToken, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      res.json(await PlaceModel.find({ owner: userData.id }));
    });
  } catch (error) {
    console.log("feaching Places error " + error);
  }
});

app.get("/places/:id", async (req, res) => {
  try {
    const { id } = req.params;
    res.json(await PlaceModel.findById(id));
  } catch (error) {
    console.log("places id error " + error);
  }
});

app.put("/places", (req, res) => {
  try {
    const { jwtToken } = req.cookies;
    const {
      id,
      title,
      address,
      addedPhotos,
      description,
      maxImg,
      price,
    } = req.body;
    jwt.verify(jwtToken, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      const placeDoc = await PlaceModel.findById(id);
      if (userData.id === placeDoc.owner.toString()) {
        placeDoc.set({
          title,
          address,
          photos: addedPhotos,
          description,
          maxImg,
          price,
        });
        await placeDoc.save();
        res.json("ok");
      }
    });
  } catch (error) {
    console.log("update places error " + error);
  }
});

app.get("/places", async (req, res) => {
  try {
    res.json(await PlaceModel.find());
  } catch (error) {
    console.log("places error ", error);
  }
});

app.delete("/places/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedPlace = await PlaceModel.findByIdAndDelete(id);
    if (!deletedPlace) {
      return res.status(404).json({ error: "Place not found" });
    }
    res.json({ message: "Place deleted successfully", deletedPlace });
  } catch (error) {
    console.error("Error deleting place:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

function getUserDataFromReq(req) {
  return new Promise((resolve, reject) => {
    jwt.verify(req.cookies.jwtToken, jwtSecret, {}, async (err, userData) => {
      resolve(userData);
    });
  }).catch((e) => {
    console.log("jwt validation error ", e);
  });
}

app.post("/bookings", async (req, res) => {
  try {
    const userData = await getUserDataFromReq(req);
    const { place, date, numberOfImg, name, mobile, price } =
      req.body;


    const bookingDoc = await Booking.create({
      place,
      date,
      numberOfImg,
      name,
      mobile,
      price,
      user: userData.id,
    });

    res.status(201).json(
      bookingDoc,
    );
  } catch (error) {
    console.log("Server Booking error: ", error);
  }
});

app.get("/bookings", async (req, res) => {
  try {
    const resData = await Booking.find().populate(
      "place"
    );
    res.status(200).json(resData);
  } catch (error) {
    console.log("Bookings error ", error);
  }
});

app.listen(8000);
