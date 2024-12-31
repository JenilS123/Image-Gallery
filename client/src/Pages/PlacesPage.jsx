import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AccountNav from "../components/AccountNav";
import axios from "axios";

const PlacesPage = () => {
  const [places, setPlaces] = useState([]);
  useEffect(() => {
    axios.get("/places").then(({ data }) => {
      setPlaces(data);
    });
  }, []);
  const handleDeletePage = async (placeId) => {
    try {
      await axios.delete(`/places/${placeId}`);
      setPlaces((prevPlaces) =>
        prevPlaces.filter((place) => place._id !== placeId)
      );
    } catch (error) {
      console.error("Error deleting page:", error);
    }
  };
  return (
    <>
      <AccountNav />
      <div className="text-center">
        <Link
          className="bg-primary py-2 px-6 text-white rounded-full inline-flex gap-1"
          to={"/account/places/new"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6"
          >
            <path
              fillRule="evenodd"
              d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z"
              clipRule="evenodd"
            />
          </svg>
          Add New Page
        </Link>
      </div>
      <div className="mt-4">
        {places?.length > 0 &&
          places.map((placeDetails, index) => (
            <div key={index} className="mb-5">
              <>
                <Link
                  key={index}
                  to={"/account/places/" + placeDetails._id}
                  className="grid gridContainer justify-center cursor-pointer gap-4 bg-gray-100 p-4 rounded-2xl grow shrink-0 relative"
                >
                  <div className="flex w-32 h-32 bg-gray-300 relative">
                    {placeDetails.photos.length > 0 && (
                      <img
                        className="object-cover rounded-2xl"
                        src={
                          "http://localhost:8000/uploads/" +
                          placeDetails.photos[0]
                        }
                        alt=""
                      />
                    )}
                  </div>
                  <div className="grow-0 shrink">
                    <h2 className="text-xl">{placeDetails.title}</h2>
                    <p className="text-sm mt-2">{placeDetails.description}</p>
                  </div>
                </Link>
                <button
                  className="relative bottom-0 my-2 bg-primary text-white p-2 rounded-2xl"
                  onClick={() => handleDeletePage(placeDetails._id)}
                >
                  Delete
                </button>
              </>
            </div>
          ))}
      </div>
    </>
  );
};

export default PlacesPage;


