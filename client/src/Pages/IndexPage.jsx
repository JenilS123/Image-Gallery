import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const IndexPage = () => {
  const [places, setPlaces] = useState([]);
  useEffect(() => {
    axios.get("/places").then((res) => {
      setPlaces(res.data);
    }).catch((e) => {
      console.log("Index Places Error ",e);
    })
  }, []);
  return (
    <div className="mt-8 grid gap-x-6 gap-y-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {places.length > 0 &&
        places.map((placeRespo, index) => (
          <Link key={index} to={"/innerPlace/"+ placeRespo._id} >
            <div className="bg-gray-500 mb-2 rounded-2xl flex">
              {placeRespo.photos?.[0] && (
                <img
                  className="rounded-2xl object-cover aspect-square"
                  src={
                    "http://localhost:8000/uploads/" + placeRespo.photos?.[0]
                  }
                  alt=""
                />
              )}
            </div>
            <h2 className="font-bold mx-2">{placeRespo.address}</h2>
            <h3 className="text-sm truncate  mx-2 text-gray-500">
              {placeRespo.title}
            </h3>
            <div className="mt-2 mx-2">
              <span className="font-bold">${placeRespo.price}</span> per Img
            </div>
          </Link>
        ))}
    </div>
  );
};

export default IndexPage;
