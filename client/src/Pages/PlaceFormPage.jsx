import React, { useEffect, useState } from "react";
import axios from "axios";
import PhotoUploader from "../components/PhotoUploader";
import AccountNav from "../components/AccountNav";
import { Navigate, useParams } from "react-router-dom";

const PlaceFormPage = () => {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [addedPhotos, setAddedPhotos] = useState([]);
  const [description, setDescription] = useState("");
  const [maxImg, setMaxImg] = useState(1);
  const [redirect, setRedirect] = useState(false);
  const [price, setPrice] = useState(100);

  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get("/places/" + id).then((res) => {
      const { data } = res;
      setTitle(data.title);
      setAddress(data.address);
      setAddedPhotos(data.photos);
      setDescription(data.description);
      setMaxImg(data.maxImg);
      setPrice(data.price)
    });
  }, [id]);

  const inputHeader = (text) => {
    return <h2 className="text-2xl mt-4">{text}</h2>;
  };
  const inputDescription = (text) => {
    return <p className="text-gray-500 text-sm">{text}</p>;
  };
  const preInput = (header, description) => {
    return (
      <>
        {inputHeader(header)}
        {inputDescription(description)}
      </>
    );
  };


  const savePlace = async (e) => {
    const placeData = {
      title,
      address,
      addedPhotos,
      description,
      maxImg,
      price
    };
    e.preventDefault();
    try {
     if (id) {
       await axios.put("/places", {
         id,...placeData
       })
       setRedirect(true)
     } else {
        await axios.post("/places", placeData);
        setRedirect(true);
     }
    } catch (error) {
      console.log("addNewImg error " + error);
    }
  };

  if (redirect) {
    return <Navigate to={"/account/places"} />;
  }

  return (
    <>
      <div>
        <AccountNav />
        <form onSubmit={savePlace}>
          {preInput(
            "Title",
            "Title for your place, should be short and catchy"
          )}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="title, for example: My lovely apt "
          />

          {preInput("Address", "Address to this place")}
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="address"
          />

          {preInput("Photos", "more = better")}
          <PhotoUploader
            addedPhotos={addedPhotos}
            setAddedPhotos={setAddedPhotos}
          />

          {preInput("Description", "Description to this place")}
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          {preInput(
            "max Img and Price"
          )}
          <div className="grid sm:grid-cols-2 md:grid-cols-4">
            <div className="mx-2">
              <h3 className="mt-2 -mb-1">Max number of Img</h3>
              <input
                type="text"
                value={maxImg}
                onChange={(e) => setMaxImg(e.target.value)}
              />
            </div>
            <div className="mx-2">
              <h3 className="mt-2 -mb-1">Price Per Img</h3>
              <input
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
          </div>
          <button className="primary my-4">Save</button>
        </form>
      </div>
    </>
  );
};

export default PlaceFormPage;
