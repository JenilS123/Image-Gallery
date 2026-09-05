import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AccountNav from "../components/AccountNav";
import axios from "axios";
import { useToast } from "../components/Toast";

const PlacesPage = () => {
  const [places, setPlaces] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    axios
      .get("/places")
      .then(({ data }) => setPlaces(data))
      .catch(() => showToast("We could not load your places.", "error"))
      .finally(() => setIsLoading(false));
  }, []);

  const handleDeletePage = async (placeId) => {
    try {
      await axios.delete(`/places/${placeId}`);
      setPlaces((prevPlaces) =>
        prevPlaces.filter((place) => place._id !== placeId)
      );
      showToast("Place deleted successfully.");
    } catch (error) {
      console.error("Error deleting page:", error);
      showToast("We could not delete this place. Please try again.", "error");
    }
  };

  return (
    <>
      <AccountNav />
      <section className="mx-auto max-w-4xl lg:max-w-6xl xl:max-w-7xl pb-10 px-2 sm:px-4">
        <div className="mb-6 flex flex-col gap-4 rounded-3xl bg-slate-900 px-5 py-6 text-white shadow-lg sm:flex-row sm:items-center sm:justify-between sm:px-8 2xl:px-12 2xl:py-10">
          <div>
            <p className="text-xs sm:text-sm font-medium text-slate-300">Property management</p>
            <h1 className="mt-1 text-2xl font-semibold sm:text-3xl 2xl:text-4xl">My places</h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-300">Manage your listings and keep them ready for bookings.</p>
          </div>
          <Link to="/account/places/new" className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-xs sm:text-sm font-semibold text-white shadow-sm transition hover:brightness-95 2xl:px-6 2xl:py-3.5">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path fillRule="evenodd" d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" /></svg>
            Add new place
          </Link>
        </div>

        {!isLoading && places.length > 0 && <p className="mb-4 text-xs sm:text-sm font-medium text-slate-500">{places.length} {places.length === 1 ? "place" : "places"} listed</p>}

        {isLoading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-xs sm:text-sm text-slate-500 shadow-sm">Loading your places...</div>
        ) : places.length === 0 ? (
          <div className="mx-auto mt-8 max-w-lg rounded-3xl border border-slate-200 bg-white px-6 py-10 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="h-7 w-7">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a.375.375 0 1 0 0-.75.375.375 0 0 0 0 .75ZM12 3.75a6 6 0 0 0-6 6c0 4.5 6 10.5 6 10.5s6-6 6-10.5a6 6 0 0 0-6-6Z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-slate-900">No places added yet</h2>
            <p className="mt-2 text-xs sm:text-sm leading-6 text-slate-500">Create your first place to start receiving bookings.</p>
            <Link to="/account/places/new" className="mt-6 inline-flex rounded-xl bg-primary px-5 py-2.5 text-xs sm:text-sm font-semibold text-white transition hover:opacity-90">Add your first place</Link>
          </div>
        ) : (
          <div className="grid gap-5 grid-cols-1 lg:grid-cols-2">
            {places.map((placeDetails) => (
              <div key={placeDetails._id} className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:border-slate-300 hover:shadow-md flex flex-col justify-between">
                <div className="flex flex-col sm:flex-row h-full">
                  <Link to={`/account/places/${placeDetails._id}`} className="h-48 shrink-0 overflow-hidden bg-slate-100 sm:h-auto sm:w-48 md:w-56 lg:w-48 xl:w-56 relative">
                    {placeDetails.photos?.[0] ? <img className="h-full w-full object-cover transition duration-500 group-hover:scale-105" src={`http://localhost:8000/uploads/${placeDetails.photos[0]}`} alt={placeDetails.title} /> : <div className="flex h-full items-center justify-center text-sm text-slate-400">No photo</div>}
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col justify-between p-4 sm:p-5">
                    <Link to={`/account/places/${placeDetails._id}`} className="group/title">
                      <h2 className="truncate text-base sm:text-lg font-semibold text-slate-900 group-hover/title:text-primary" title={placeDetails.title}>{placeDetails.title}</h2>
                      <p className="mt-0.5 truncate text-xs sm:text-sm font-medium text-slate-500">{placeDetails.address}</p>
                      <p className="mt-3 line-clamp-2 text-xs sm:text-sm leading-6 text-slate-600">{placeDetails.description || "No description added yet."}</p>
                    </Link>
                    <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-100 pt-3">
                      <span className="text-xs sm:text-sm font-semibold text-slate-700">${placeDetails.price || 0} <span className="font-normal text-slate-500">per image</span></span>
                      <div className="flex items-center gap-2">
                        <Link to={`/account/places/${placeDetails._id}`} className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs sm:text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-primary">Edit</Link>
                        <button className="rounded-xl border border-red-200 bg-white px-3 py-1.5 text-xs sm:text-sm font-semibold text-red-600 transition hover:bg-red-50" onClick={() => handleDeletePage(placeDetails._id)}>Delete</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
};

export default PlacesPage;


