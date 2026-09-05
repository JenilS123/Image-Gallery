import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const IndexPage = () => {
  const [places, setPlaces] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPlaces, setTotalPlaces] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const limit = 8;

  useEffect(() => {
    setIsLoading(true);
    axios
      .get("/places", {
        params: {
          page: currentPage,
          limit,
          search: activeSearch,
        },
      })
      .then((res) => {
        if (res.data && Array.isArray(res.data.places)) {
          setPlaces(res.data.places);
          setTotalPages(res.data.totalPages || 1);
          setTotalPlaces(res.data.totalPlaces || res.data.places.length);
        } else if (Array.isArray(res.data)) {
          setPlaces(res.data);
          setTotalPages(1);
          setTotalPlaces(res.data.length);
        }
      })
      .catch((e) => console.log("Index Places Error ", e))
      .finally(() => setIsLoading(false));
  }, [currentPage, activeSearch]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    setActiveSearch(searchQuery.trim());
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setActiveSearch("");
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 350, behavior: "smooth" });
    }
  };

  return (
    <main className="mx-auto mt-4 sm:mt-8 max-w-full 2xl:max-w-[1700px] 3xl:max-w-[2200px] 4k:max-w-[2800px] pb-12">
      {/* Hero Banner with Embedded Search Bar */}
      <section className="relative overflow-hidden rounded-3xl bg-slate-900 px-6 py-10 text-white shadow-lg sm:px-10 sm:py-14 lg:py-16 2xl:px-16 2xl:py-20 3xl:py-24 4k:px-24 4k:py-32">
        <div className="relative z-10 max-w-2xl 2xl:max-w-4xl 4k:max-w-6xl">
          <p className="text-xs sm:text-sm 2xl:text-base 4k:text-xl font-semibold uppercase tracking-[0.18em] text-primary">
            Image booking marketplace
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-5xl lg:text-6xl 2xl:text-7xl 4k:text-8xl">
            Find the right place for your next shoot.
          </h1>
          <p className="mt-4 max-w-xl text-sm sm:text-base lg:text-lg 2xl:text-xl 4k:text-2xl leading-7 text-slate-300">
            Browse unique locations, compare prices, search by location or keywords, and reserve the images you need.
          </p>

          {/* Search Input Bar */}
          <form onSubmit={handleSearchSubmit} className="mt-6 sm:mt-8 flex max-w-xl items-center rounded-2xl bg-white/10 p-1.5 backdrop-blur-md border border-white/20 shadow-xl focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/40 transition duration-300">
            <div className="flex flex-1 items-center px-3 gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-slate-300">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search places by title, location, or description..."
                className="w-full bg-transparent py-2 text-sm sm:text-base text-white placeholder-slate-400 focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  aria-label="Clear search"
                  className="rounded-full p-1 text-slate-300 hover:text-white hover:bg-white/20 transition cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            <button
              type="submit"
              className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:brightness-110 transition cursor-pointer flex items-center gap-2"
            >
              <span>Search</span>
            </button>
          </form>
        </div>

        <div className="absolute -right-20 -top-20 h-64 w-64 2xl:h-96 2xl:w-96 4k:h-[500px] 4k:w-[500px] rounded-full bg-primary/30 blur-3xl" />
        <div className="absolute -bottom-28 right-1/4 h-52 w-52 2xl:h-80 2xl:w-80 4k:h-[400px] 4k:w-[400px] rounded-full bg-sky-400/15 blur-3xl" />
      </section>

      {/* Section Header & Active Filter Bar */}
      <div className="mt-8 sm:mt-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs sm:text-sm 2xl:text-base 4k:text-xl font-medium text-primary">Explore locations</p>
          <h2 className="mt-1 text-2xl font-semibold text-slate-900 sm:text-3xl 2xl:text-4xl 4k:text-5xl">
            {activeSearch ? `Search Results for "${activeSearch}"` : "Available places"}
          </h2>
        </div>

        <div className="flex items-center gap-3">
          {activeSearch && (
            <button
              onClick={handleClearSearch}
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition cursor-pointer"
            >
              <span>Clear Filter</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5 text-slate-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          )}

          {!isLoading && totalPlaces > 0 && (
            <p className="text-xs sm:text-sm 2xl:text-base 4k:text-xl text-slate-500">
              Showing {places.length} of {totalPlaces} {totalPlaces === 1 ? "place" : "places"}
            </p>
          )}
        </div>
      </div>

      {/* Places Content Grid */}
      {isLoading ? (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-12 text-center text-sm sm:text-base 2xl:text-lg 4k:text-2xl text-slate-500 shadow-sm flex flex-col items-center justify-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <span>Searching location database...</span>
        </div>
      ) : places.length === 0 ? (
        <div className="mx-auto mt-6 max-w-lg 2xl:max-w-2xl 4k:max-w-4xl rounded-3xl border border-slate-200 bg-white px-6 py-12 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-14 w-14 2xl:h-20 2xl:w-20 4k:h-28 4k:w-28 items-center justify-center rounded-full bg-primary/10 text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="h-7 w-7 2xl:h-10 2xl:w-10 4k:h-14 4k:w-14">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-slate-900 2xl:text-3xl 4k:text-4xl">
            {activeSearch ? `No places match "${activeSearch}"` : "No places available yet"}
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-500 2xl:text-lg 4k:text-2xl">
            {activeSearch
              ? "Try searching for a different city, keyword, or clear your search filter."
              : "New places will appear here as soon as they are added. Please check back soon."}
          </p>
          {activeSearch && (
            <button
              onClick={handleClearSearch}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-md hover:bg-slate-800 transition cursor-pointer"
            >
              Clear Search Query
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 4k:grid-cols-8">
            {places.map((placeRespo) => (
              <Link
                key={placeRespo._id}
                to={`/innerPlace/${placeRespo._id}`}
                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg flex flex-col"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                  {placeRespo.photos?.[0] ? (
                    <img
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      loading="lazy"
                      decoding="async"
                      src={`http://localhost:8000/uploads/${placeRespo.photos[0]}`}
                      alt={placeRespo.title}
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-slate-400">No photo available</div>
                  )}
                  <span className="absolute bottom-3 right-3 rounded-lg bg-white/95 px-3 py-1.5 text-xs sm:text-sm 2xl:text-base 4k:text-xl font-semibold text-slate-900 shadow-sm backdrop-blur-sm">
                    ${placeRespo.price || 0}<span className="font-normal text-slate-500"> / image</span>
                  </span>
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <p className="truncate text-xs sm:text-sm 2xl:text-base 4k:text-lg font-medium text-slate-500">{placeRespo.address}</p>
                  <h3 className="mt-1 truncate text-base sm:text-lg 2xl:text-xl 4k:text-2xl font-semibold text-slate-900 group-hover:text-primary">
                    {placeRespo.title}
                  </h3>
                  <div className="mt-auto pt-3 flex items-center gap-1 text-xs sm:text-sm 2xl:text-base 4k:text-lg font-semibold text-primary">
                    View details <span aria-hidden="true">-&gt;</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination Navigation */}
          {totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-3">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs sm:text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white cursor-pointer disabled:cursor-not-allowed"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                </svg>
                Previous
              </button>

              <div className="flex items-center gap-1.5 px-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`h-9 w-9 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer ${
                      currentPage === pageNum
                        ? "bg-slate-900 text-white shadow-md"
                        : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs sm:text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white cursor-pointer disabled:cursor-not-allowed"
              >
                Next
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </div>
          )}
        </>
      )}
    </main>
  );
};

export default IndexPage;
