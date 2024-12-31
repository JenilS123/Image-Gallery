import React, { useEffect, useState } from "react";
import AccountNav from "../components/AccountNav";
import axios from "axios";

const BookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  useEffect(() => {
    axios
      .get("/bookings")
      .then((response) => {
        setBookings(response.data);
      })
      .catch((err) => {
        console.log("Bookings Page error: ", err);
      });
  }, []);
  return (
    <>
      <AccountNav />
      <div>
        {bookings?.length > 0 &&
          bookings.map((booking, index) => (
            <div
              className="flex gap-4 bg-gray-200 rounded-2xl overflow-hidden mb-5"
              key={index}
            >
              <div className="w-64">
                <img
                  className="p-3"
                  src={
                    "http://localhost:8000/uploads/" + booking.place.photos[0]
                  }
                  alt=""
                />
              </div>
              <div className="py-3 pr-3 grow">
                <h2 className="text-xl">{booking.place.title}</h2>
                <div className="flex gap-1">Total Price: ${booking.price}</div>
              </div>
            </div>
          ))}
      </div>
    </>
  );
};

export default BookingsPage;
