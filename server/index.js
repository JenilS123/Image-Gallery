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
const path = require("path");
const app = express();

const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  console.error("FATAL ERROR: JWT_SECRET environment variable is missing.");
  process.exit(1);
}

const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

let sharp;
try {
  sharp = require("sharp");
} catch (e) {
  console.log("Sharp image optimization library loading notice:", e.message);
}

let compression;
try {
  compression = require("compression");
} catch (e) {
  console.log("Compression library notice:", e.message);
}

if (compression) {
  app.use(compression());
}

app.use(
  cors({
    credentials: true,
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      return callback(null, origin);
    },
  })
);
app.use(
  "/uploads",
  express.static(uploadsDir, {
    maxAge: "1y",
    etag: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User Already Exits" });
    }

    const user = await UserModel.create({
      name,
      email,
      password: bcrypt.hashSync(password, bcryptSalt),
    });
    return res.status(201).json(user);
  } catch (error) {
    console.log("register error: ", error);
    return res.status(422).json({ message: "Something Went Wrong" });
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
            res.status(200).cookie("jwtToken", token, { path: "/", sameSite: "lax", httpOnly: true }).json(user);
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
    res.status(500).json({ message: "Internal server error during login" });
  }
});

app.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email address is required" });
    }
    const cleanEmail = email.trim().toLowerCase();
    const user = await UserModel.findOne({
      $or: [
        { email: cleanEmail },
        { email: new RegExp(`^${cleanEmail}$`, "i") }
      ]
    });

    if (!user) {
      return res.status(404).json({ message: "No account found with this email address." });
    }

    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const resetCodeExpires = new Date(Date.now() + 15 * 60 * 1000);

    user.resetCode = resetCode;
    user.resetCodeExpires = resetCodeExpires;
    await user.save();

    console.log(`Password reset code generated for ${user.email}: ${resetCode}`);

    return res.status(200).json({
      message: "Verification code sent successfully!",
      resetCode,
      email: user.email,
    });
  } catch (error) {
    console.log("forgot-password error: ", error);
    return res.status(500).json({ message: "Failed to generate verification code. Please try again." });
  }
});

app.post("/reset-password", async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;

    if (!email || !code || !newPassword) {
      return res.status(400).json({ message: "Email, verification code, and new password are required." });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = await UserModel.findOne({
      $or: [
        { email: cleanEmail },
        { email: new RegExp(`^${cleanEmail}$`, "i") }
      ]
    });

    if (!user) {
      return res.status(404).json({ message: "User account not found." });
    }

    if (!user.resetCode || user.resetCode !== code.trim()) {
      return res.status(400).json({ message: "Invalid 6-digit verification code. Please double check." });
    }

    if (!user.resetCodeExpires || new Date() > new Date(user.resetCodeExpires)) {
      return res.status(400).json({ message: "Verification code has expired. Please request a new code." });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters long." });
    }

    user.password = bcrypt.hashSync(newPassword, bcryptSalt);
    user.resetCode = null;
    user.resetCodeExpires = null;
    await user.save();

    return res.status(200).json({ message: "Password reset successfully! You can now sign in with your new password." });
  } catch (error) {
    console.log("reset-password error: ", error);
    return res.status(500).json({ message: "Failed to reset password. Please try again." });
  }
});

app.get("/profile", (req, res) => {
  try {
    const { jwtToken } = req.cookies;
    if (jwtToken) {
      jwt.verify(jwtToken, jwtSecret, {}, async (err, userData) => {
        if (err || !userData) {
          return res.status(401).json(null);
        }
        try {
          const user = await UserModel.findById(userData.id);
          if (!user) return res.status(401).json(null);
          const { name, email, _id } = user;
          res.json({ name, email, _id });
        } catch (dbErr) {
          res.status(500).json(null);
        }
      });
    } else {
      res.status(401).json(null);
    }
  } catch (error) {
    console.log("profile error" + error);
    res.status(500).json(null);
  }
});

app.post("/logout", (req, res) => {
  res.cookie("jwtToken", "", {
    expires: new Date(0),
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });
  res.clearCookie("jwtToken", { path: "/" });
  res.json(true);
});

async function processAndSaveImage(sourcePath, targetFileName) {
  const targetPath = path.join(uploadsDir, targetFileName);
  if (sharp) {
    try {
      await sharp(sourcePath)
        .resize(1200, 1200, { fit: "inside", withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(targetPath);

      if (sourcePath !== targetPath && fs.existsSync(sourcePath)) {
        fs.unlinkSync(sourcePath);
      }
      return targetFileName;
    } catch (err) {
      console.error("Sharp image optimization error, using original file:", err);
    }
  }
  if (sourcePath !== targetPath && fs.existsSync(sourcePath)) {
    fs.renameSync(sourcePath, targetPath);
  }
  return targetFileName;
}

app.post("/upload-by-link", async (req, res) => {
  try {
    const { link } = req.body;
    if (!link) {
      return res.status(400).json({ error: "Image link URL is required" });
    }
    const tempName = "temp_" + Date.now() + ".jpg";
    const tempPath = path.join(uploadsDir, tempName);
    await imageDownloaded.image({
      url: link,
      dest: tempPath,
    });
    const finalName = "photo" + Date.now() + ".webp";
    const savedName = await processAndSaveImage(tempPath, finalName);
    res.json(savedName);
  } catch (error) {
    console.error("upload-by-link error: ", error);
    res.status(422).json({ error: "Could not download image from provided URL" });
  }
});

const photoMiddleWare = multer({ dest: uploadsDir });

app.post("/upload", (req, res) => {
  photoMiddleWare.array("photos", 100)(req, res, async (err) => {
    if (err) {
      console.error("Multer middleware error: ", err);
      return res.status(400).json({ error: err.message || "File upload middleware error" });
    }
    try {
      const uploadfiles = [];
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: "No files provided for upload" });
      }
      for (let i = 0; i < req.files.length; i++) {
        const { path: filePath } = req.files[i];
        const finalName = "photo" + Date.now() + "_" + i + ".webp";
        const savedName = await processAndSaveImage(filePath, finalName);
        uploadfiles.push(savedName);
      }
      res.json(uploadfiles);
    } catch (error) {
      console.error("upload process error: ", error);
      res.status(500).json({ error: "Failed to process photo upload" });
    }
  });
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
      if (err || !userData) {
        return res.status(401).json({ error: "Unauthorized access" });
      }
      try {
        const placeDoc = await PlaceModel.create({
          owner: userData.id,
          title,
          address,
          photos: addedPhotos,
          description,
          maxImg,
          price,
        });
        res.status(201).json(placeDoc);
      } catch (dbErr) {
        console.error("Create place error:", dbErr);
        res.status(422).json({ error: dbErr.message || "Failed to create place" });
      }
    });
  } catch (error) {
    console.log("places error " + error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/user-places", (req, res) => {
  try {
    const { jwtToken } = req.cookies;
    jwt.verify(jwtToken, jwtSecret, {}, async (err, userData) => {
      if (err || !userData) {
        return res.status(401).json({ error: "Unauthorized access" });
      }
      try {
        const places = await PlaceModel.find({ owner: userData.id });
        res.json(places);
      } catch (dbErr) {
        res.status(500).json({ error: "Failed to fetch user places" });
      }
    });
  } catch (error) {
    console.log("fetching Places error " + error);
    res.status(500).json({ error: "Internal server error" });
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

app.post("/delete-photo", (req, res) => {
  try {
    const { filename } = req.body;
    if (!filename) {
      return res.status(400).json({ error: "Filename is required" });
    }
    const cleanFilename = path.basename(filename);
    const filePath = path.join(__dirname, "uploads", cleanFilename);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return res.json({ message: "Photo deleted successfully", filename: cleanFilename });
    } else {
      return res.status(404).json({ error: "File not found" });
    }
  } catch (error) {
    console.error("Error deleting photo file:", error);
    res.status(500).json({ error: "Could not delete photo file" });
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
        // Unlink any photos that were removed during place edit
        if (placeDoc.photos && Array.isArray(placeDoc.photos)) {
          const removedPhotos = placeDoc.photos.filter((p) => !addedPhotos.includes(p));
          removedPhotos.forEach((photo) => {
            const cleanFilename = path.basename(photo);
            const filePath = path.join(__dirname, "uploads", cleanFilename);
            if (fs.existsSync(filePath)) {
              fs.unlinkSync(filePath);
            }
          });
        }

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
    const { search } = req.query;
    const page = parseInt(req.query.page, 10);
    const limit = parseInt(req.query.limit, 10) || 8;

    const filter = {};
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), "i");
      filter.$or = [
        { title: searchRegex },
        { address: searchRegex },
        { description: searchRegex },
      ];
    }

    if (page && page > 0) {
      const totalPlaces = await PlaceModel.countDocuments(filter);
      const totalPages = Math.max(1, Math.ceil(totalPlaces / limit));
      const currentPage = Math.min(page, totalPages);
      const skip = (currentPage - 1) * limit;

      const places = await PlaceModel.find(filter)
        .skip(skip)
        .limit(limit);

      return res.json({
        places,
        totalPlaces,
        totalPages,
        currentPage,
        limit,
      });
    }

    const places = await PlaceModel.find(filter);
    if (search && search.trim()) {
      return res.json({
        places,
        totalPlaces: places.length,
        totalPages: 1,
        currentPage: 1,
        limit: places.length,
      });
    }

    res.json(places);
  } catch (error) {
    console.log("places error ", error);
    res.status(500).json({ error: "Failed to fetch places" });
  }
});

app.delete("/places/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedPlace = await PlaceModel.findByIdAndDelete(id);
    if (!deletedPlace) {
      return res.status(404).json({ error: "Place not found" });
    }

    // Physical deletion of all photos associated with this place from server/uploads
    if (deletedPlace.photos && Array.isArray(deletedPlace.photos)) {
      deletedPlace.photos.forEach((photo) => {
        const cleanFilename = path.basename(photo);
        const filePath = path.join(__dirname, "uploads", cleanFilename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
    }

    res.json({ message: "Place and photos deleted successfully", deletedPlace });
  } catch (error) {
    console.error("Error deleting place:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

function getUserDataFromReq(req) {
  return new Promise((resolve, reject) => {
    const token = req.cookies?.jwtToken;
    if (!token) return reject(new Error("No token provided"));
    jwt.verify(token, jwtSecret, {}, (err, userData) => {
      if (err || !userData) return reject(err || new Error("Invalid token"));
      resolve(userData);
    });
  });
}

app.post("/bookings", async (req, res) => {
  try {
    const userData = await getUserDataFromReq(req);
    const { place, date, numberOfImg, name, mobile, price } = req.body;

    const bookingDoc = await Booking.create({
      place,
      date,
      numberOfImg,
      name,
      mobile,
      price,
      user: userData.id,
    });

    res.status(201).json(bookingDoc);
  } catch (error) {
    console.error("Server Booking error: ", error);
    res.status(422).json({ error: error.message || "Failed to create booking" });
  }
});

app.get("/bookings", async (req, res) => {
  try {
    const userData = await getUserDataFromReq(req);
    const resData = await Booking.find({ user: userData.id }).populate("place");
    res.status(200).json(resData);
  } catch (error) {
    console.error("Bookings error ", error);
    res.status(401).json({ error: "Unauthorized access to bookings" });
  }
});

app.delete("/bookings/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const resData = await Booking.findByIdAndDelete(id)
    if (!resData) {
      return res.status(404).json({ error: "Booking not found" });
    }
    res.json({ message: "Booking deleted successfully", resData });
  } catch (error) {
    console.log("Booking deleting error ", error);
  }
});

app.listen(8000);