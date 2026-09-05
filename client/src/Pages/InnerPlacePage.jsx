import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import BookingWidget from "../components/BookingWidget";

const InnerPlacePage = () => {
  const [place, setPlace] = useState(null);
  const [showAllPhoto, setShowAllPhoto] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    if (!id) return;
    axios.get(`/places/${id}`).then((respo) => {
      setPlace(respo.data);
    });
  }, [id]);

  if (!place) return "";

  if (showAllPhoto) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/95 px-4 py-6 text-white sm:px-8 sm:py-10 2xl:px-12 4k:px-20">
        <div className="mx-auto max-w-5xl 2xl:max-w-7xl 3xl:max-w-[2000px] 4k:max-w-[2600px]">
          <div className="sticky top-0 z-10 mb-6 flex items-center justify-between rounded-2xl bg-slate-900/90 px-4 py-3 shadow-lg backdrop-blur sm:px-6 2xl:py-5">
            <div>
              <p className="text-xs sm:text-sm 2xl:text-base 4k:text-xl font-medium text-slate-300">Photo gallery</p>
              <h2 className="text-xl font-semibold sm:text-2xl 2xl:text-4xl 4k:text-5xl">{place.title}</h2>
            </div>
            <button
              onClick={() => setShowAllPhoto(false)}
              className="flex items-center gap-1.5 rounded-xl bg-white px-3 py-2 text-xs sm:text-sm 2xl:text-base 4k:text-xl font-semibold text-slate-900 shadow-sm transition hover:bg-slate-200 sm:px-4 2xl:px-6 2xl:py-3"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5 2xl:w-6 2xl:h-6 4k:w-8 4k:h-8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
              Close
            </button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 4k:grid-cols-5 sm:gap-5">
            {place?.photos?.length > 0 &&
              place.photos.map((photoReturn, index) => (
                <figure key={photoReturn} className="flex h-[220px] items-center justify-center overflow-hidden rounded-2xl bg-slate-900 shadow-xl sm:h-[280px] lg:h-[340px] 2xl:h-[420px] 4k:h-[580px]">
                  <img
                    className="h-full w-full object-contain"
                    loading="lazy"
                    decoding="async"
                    src={"http://localhost:8000/uploads/" + photoReturn}
                    alt={`${place.title} photo ${index + 1}`}
                  />
                </figure>
              ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="mx-auto mt-4 sm:mt-8 max-w-full 2xl:max-w-[1700px] 3xl:max-w-[2200px] 4k:max-w-[2800px] pb-12">
      <Link to="/" className="inline-flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs sm:text-sm 2xl:text-base 4k:text-xl font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900">
        <span aria-hidden="true">&lt;-</span> Back to places
      </Link>
      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs sm:text-sm 2xl:text-base 4k:text-xl font-medium text-primary">Featured location</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900 sm:text-4xl 2xl:text-5xl 4k:text-6xl">{place.title}</h1>
          <a className="mt-3 inline-flex items-center gap-1.5 text-xs sm:text-sm 2xl:text-base 4k:text-xl font-semibold text-slate-600 transition hover:text-primary" target="_blank" rel="noreferrer" href={"http://maps.google.com/?q=" + place.address}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5 2xl:h-6 2xl:w-6 4k:h-8 4k:w-8"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" /></svg>
            {place.address}
          </a>
        </div>
        <div className="rounded-xl bg-primary/10 px-4 py-2 text-xs sm:text-sm 2xl:text-base 4k:text-xl font-semibold text-primary">${place.price || 0} <span className="font-normal">per image</span></div>
      </div>

      {/* Main Collage */}
      <div className="relative mt-6">
        <div className="grid h-[260px] grid-cols-[1.6fr_1fr] gap-2 overflow-hidden rounded-2xl bg-slate-200 shadow-sm sm:h-[340px] lg:h-[420px] 2xl:h-[540px] 3xl:h-[680px] 4k:h-[850px]">
          <div className="relative min-h-0 overflow-hidden bg-slate-200">
            {place.photos?.[0] && (
              <img
                className="absolute inset-0 block h-full w-full object-cover object-center transition duration-500 hover:scale-105"
                loading="lazy"
                decoding="async"
                src={"http://localhost:8000/uploads/" + place.photos[0]}
                alt={`${place.title} main photo`}
              />
            )}
          </div>
          <div className="grid grid-rows-2 gap-2">
            <div className="relative min-h-0 overflow-hidden bg-slate-200">
              {place.photos?.[1] && (
                <img
                  className="absolute inset-0 block h-full w-full object-cover object-center transition duration-500 hover:scale-105"
                  loading="lazy"
                  decoding="async"
                  src={"http://localhost:8000/uploads/" + place.photos[1]}
                  alt={`${place.title} photo 2`}
                />
              )}
            </div>
            <div className="relative min-h-0 overflow-hidden bg-slate-200">
              {place.photos?.[2] && (
                <img
                  className="absolute inset-0 block h-full w-full object-cover object-center transition duration-500 hover:scale-105"
                  loading="lazy"
                  decoding="async"
                  src={"http://localhost:8000/uploads/" + place.photos[2]}
                  alt={`${place.title} photo 3`}
                />
              )}
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowAllPhoto(true)}
          className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white/95 px-3 py-2 text-xs sm:text-sm 2xl:text-base 4k:text-xl font-semibold shadow-md transition hover:bg-white sm:px-4 2xl:px-6 2xl:py-3"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5 2xl:w-6 2xl:h-6 4k:w-8 4k:h-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
            />
          </svg>
          See all photos{place.photos?.length ? ` (${place.photos.length})` : ""}
        </button>
      </div>

      <div className="mt-8 grid gap-6 grid-cols-1 lg:grid-cols-[minmax(0,1.6fr)_minmax(340px,.8fr)] 2xl:grid-cols-[minmax(0,2fr)_minmax(420px,1fr)] 4k:grid-cols-[minmax(0,2.5fr)_minmax(520px,1fr)] lg:items-start">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 2xl:p-8 4k:p-12 shadow-sm">
          <h2 className="text-lg sm:text-xl 2xl:text-2xl 4k:text-4xl font-semibold text-slate-900">About this place</h2>
          <p className="mt-3 whitespace-pre-line leading-7 text-xs sm:text-sm md:text-base 2xl:text-lg 4k:text-2xl text-slate-600">{place.description || "No description has been added for this place yet."}</p>
          <div className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-5">
            <div className="flex h-10 w-10 2xl:h-14 2xl:w-14 4k:h-18 4k:w-18 items-center justify-center rounded-full bg-primary/10 text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="h-5 w-5 2xl:h-7 2xl:w-7 4k:h-10 4k:w-10"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" /><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
            </div>
            <div>
              <p className="text-xs sm:text-sm 2xl:text-base 4k:text-xl font-semibold text-slate-900">Up to {place.maxImg || 1} images per booking</p>
              <p className="text-xs sm:text-sm 2xl:text-base 4k:text-lg text-slate-500">Choose the number of images when booking.</p>
            </div>
          </div>
        </section>
        <aside className="lg:sticky lg:top-24">
          <BookingWidget place={place} />
        </aside>
      </div>
    </main>
  );
};

export default InnerPlacePage;

