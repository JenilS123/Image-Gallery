import React, { useEffect, useState } from "react";
import AccountNav from "../components/AccountNav";
import axios from "axios";
import { Link } from "react-router-dom";
import { useToast } from "../components/Toast";

const BookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    axios
      .get("/bookings")
      .then((response) => {
        setBookings(response.data);
      })
      .catch((err) => {
        console.log("Bookings Page error: ", err);
        showToast("We could not load your bookings.", "error");
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleDeletePage = async (placeId) => {
    try {
      await axios.delete(`/bookings/${placeId}`);
      setBookings((prevPlaces) =>
        prevPlaces.filter((place) => place._id !== placeId)
      );
      showToast("Booking deleted successfully.");
    } catch (error) {
      console.error("Error deleting page:", error);
      showToast("We could not delete this booking. Please try again.", "error");
    }
  };

  const validBookings = bookings.filter((booking) => booking.place != null);

  return (
    <>
      <AccountNav />
      <main className="mx-auto max-w-4xl lg:max-w-6xl xl:max-w-7xl pb-10 px-2 sm:px-4">
        <div className="mb-6 rounded-3xl bg-slate-900 px-6 py-7 text-white shadow-lg sm:px-8 2xl:px-12 2xl:py-10">
          <p className="text-xs sm:text-sm 2xl:text-base font-medium text-slate-300">Your reservations</p>
          <h1 className="mt-1 text-2xl font-semibold sm:text-3xl 2xl:text-4xl">My bookings</h1>
          <p className="mt-2 text-xs sm:text-sm 2xl:text-base text-slate-300">Review and manage all your image bookings in one place.</p>
        </div>

        {!isLoading && validBookings.length > 0 && (
          <p className="mb-4 text-xs sm:text-sm font-medium text-slate-500">
            {validBookings.length} active {validBookings.length === 1 ? "booking" : "bookings"}
          </p>
        )}

        {isLoading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-xs sm:text-sm text-slate-500 shadow-sm">
            Loading your bookings...
          </div>
        ) : validBookings.length === 0 ? (
          <div className="mx-auto mt-10 max-w-lg rounded-3xl border border-slate-200 bg-white px-6 py-10 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.8}
                stroke="currentColor"
                className="h-7 w-7"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v2.25M15.75 3v2.25M3.75 9h16.5M4.5 5.25h15A1.5 1.5 0 0 1 21 6.75v12A1.5 1.5 0 0 1 19.5 20.25h-15A1.5 1.5 0 0 1 3 18.75v-12a1.5 1.5 0 0 1 1.5-1.5Z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-slate-900">No bookings yet</h2>
            <p className="mt-2 text-xs sm:text-sm leading-6 text-slate-500">
              When you book a place, it will appear here for easy access.
            </p>
            <Link
              to="/"
              className="mt-6 inline-flex rounded-xl bg-primary px-5 py-2.5 text-xs sm:text-sm font-semibold text-white transition hover:opacity-90"
            >
              Explore places
            </Link>
          </div>
        ) : (
          <div className="grid gap-5 grid-cols-1 lg:grid-cols-2">
            {validBookings.map((booking) => (
              <article
                className="group flex flex-col sm:flex-row overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:border-slate-300 hover:shadow-md"
                key={booking._id}
              >
                <div className="h-48 sm:h-auto sm:w-48 md:w-56 lg:w-48 xl:w-56 shrink-0 bg-slate-100 relative overflow-hidden">
                  {booking.place.photos?.[0] ? (
                    <img
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      src={`http://localhost:8000/uploads/${booking.place.photos[0]}`}
                      alt={booking.place.title || "Place image"}
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-slate-400">No photo</div>
                  )}
                </div>

                <div className="flex min-w-0 flex-1 flex-col justify-between p-4 sm:p-5">
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <h2 className="truncate text-base sm:text-lg font-semibold text-slate-900" title={booking.place.title}>
                          {booking.place.title}
                        </h2>
                        <p className="mt-0.5 truncate text-xs sm:text-sm text-slate-500">{booking.place.address}</p>
                      </div>
                      <span className="shrink-0 rounded-full bg-primary/10 px-3 py-1 text-xs sm:text-sm font-semibold text-primary">
                        ${booking.price}
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-100 pt-3 text-xs sm:text-sm">
                      <div className="min-w-0">
                        <span className="text-slate-500 font-medium">Booking date</span>
                        <p className="mt-0.5 truncate font-semibold text-slate-800">
                          {booking.date ? new Date(booking.date).toLocaleDateString() : "N/A"}
                        </p>
                      </div>
                      <div className="min-w-0">
                        <span className="text-slate-500 font-medium">Images</span>
                        <p className="mt-0.5 truncate font-semibold text-slate-800">{booking.numberOfImg}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-end border-t border-slate-100 pt-3">
                    <button
                      className="rounded-xl border border-red-200 bg-white px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-red-600 transition hover:bg-red-50"
                      onClick={() => handleDeletePage(booking._id)}
                    >
                      Cancel booking
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </>
  );
};

export default BookingsPage;


