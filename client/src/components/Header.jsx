import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../Pages/UserContext";

const Header = () => {
  const { user } = useContext(UserContext);
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md transition-all duration-300">
      <div className="mx-auto flex max-w-full items-center justify-between px-3 py-3 sm:px-6 md:px-8 lg:px-10 2xl:max-w-[1700px] 2xl:px-12 3xl:max-w-[2200px] 3xl:px-16 4k:max-w-[2800px] 4k:px-24 4k:py-5">
        {/* Logo */}
        <Link to={"/"} className="flex items-center gap-2 text-primary transition duration-200 hover:opacity-90">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-7 w-7 sm:h-8 sm:w-8 2xl:h-9 2xl:w-9 4k:h-12 4k:w-12"
          >
            <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
          </svg>
          <span className="font-bold text-lg tracking-tight text-slate-900 sm:text-xl md:text-2xl 2xl:text-3xl 4k:text-4xl">
            Image-Gallery
          </span>
        </Link>

        {/* Search Bar - Tablet & Desktop */}
        <div className="hidden sm:flex items-center gap-2 rounded-full border border-slate-200 bg-white py-2 px-4 text-xs font-semibold text-slate-700 shadow-sm transition hover:shadow-md md:text-sm md:py-2.5 md:px-5 2xl:text-base 2xl:py-3 2xl:px-7 4k:text-xl 4k:py-4 4k:px-10">
          <span className="hover:text-primary transition cursor-pointer">Anywhere</span>
          <span className="h-4 border-l border-slate-200"></span>
          <span className="hover:text-primary transition cursor-pointer">Any week</span>
          <span className="h-4 border-l border-slate-200"></span>
          <span className="text-slate-400 font-normal hover:text-primary transition cursor-pointer">Add guests</span>
          <button aria-label="Search" className="ml-1 rounded-full bg-primary p-1.5 text-white transition hover:brightness-95 2xl:p-2 4k:p-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-3.5 w-3.5 md:h-4 md:w-4 2xl:h-5 2xl:w-5 4k:h-6 4k:w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
          </button>
        </div>

        {/* Compact Search Icon for Mobile (< 640px) */}
        <div className="sm:hidden flex items-center">
          <button aria-label="Search places" className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 py-1.5 px-3 text-xs font-semibold text-slate-700 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4 text-primary">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <span>Search</span>
          </button>
        </div>

        {/* User Account / Login Badge */}
        <Link
          to={user ? "/account" : "/login"}
          className="flex items-center gap-2 rounded-full border border-slate-200 bg-white py-1.5 px-3 text-xs font-semibold text-slate-700 shadow-sm transition hover:shadow-md sm:py-2 sm:px-4 md:text-sm 2xl:py-2.5 2xl:px-5 2xl:text-base 4k:py-3.5 4k:px-7 4k:text-xl"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.75}
            stroke="currentColor"
            className="h-5 w-5 text-slate-500 2xl:h-6 2xl:w-6 4k:h-8 4k:w-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
          <div className="flex items-center justify-center rounded-full bg-slate-500 text-white p-0.5 2xl:p-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-5 w-5 2xl:h-6 2xl:w-6 4k:h-8 4k:w-8"
            >
              <path
                fillRule="evenodd"
                d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          {!!user && (
            <span className="max-w-[80px] truncate sm:max-w-[140px] md:max-w-[180px] lg:max-w-[220px] 2xl:max-w-[300px] font-semibold text-slate-800">
              {user.name}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
};

export default Header;

