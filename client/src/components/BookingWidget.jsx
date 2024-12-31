import React, { useContext, useState } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { UserContext } from "../Pages/UserContext";
import { useEffect } from "react";

const BookingWidget = ({ place }) => {
  const [date, setDate] = useState("");
  const [numberOfImg, setNumberOfImg] = useState(1);
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [redirect, setRedirect] = useState("");
  const { user } = useContext(UserContext);

  useEffect(() => {
    if (user) {
      setName(user.name)
    } else {
      setName("")
    }
  }, [user]);

  const bookThisPlace = async () => {
    try {
      await axios.post("/bookings", {
        place: place._id,
        date,
        numberOfImg,
        name,
        mobile,
        price: numberOfImg * place.price,
      });
      alert("Your Booking Successfull");
      setRedirect(`/account/bookings/`);
    } catch (error) {
      console.log("client bookthisplace error: ", error);
    }
  };

  if (redirect) {
    return <Navigate to={redirect} />;
  }

  return (
    <>
      <div>
        <div className="bg-white shadow p-4 rounded-2xl">
          <div className="text-2xl text-center">
            Price: ${place.price} / per Img
          </div>
          <div className="border rounded-2xl mt-4">
            <div className="grid grid-cols-2">
              <div className="py-3 px-4">
                <label>Date:</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
            </div>
            <div className="py-3 px-4 border-t">
              <label>Number of Img:</label>
              <input
                type="number"
                value={numberOfImg}
                onChange={(e) => setNumberOfImg(e.target.value)}
              />
            </div>

            {numberOfImg > 0 && (
              <div className="py-3 px-4 border-t">
                <label>Your full name: </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <label>Phone Number: </label>
                <input
                  type="tel"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                />
              </div>
            )}
          </div>
          <button className="primary my-2" onClick={bookThisPlace}>
            Book this Place{" "}
            {numberOfImg > 0 && <span>${numberOfImg * place.price} </span>}
          </button>
        </div>
      </div>
    </>
  );
};

export default BookingWidget;
