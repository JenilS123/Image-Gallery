import React, { useContext, useState } from "react";
import { UserContext } from "./UserContext";
import { Navigate, useParams } from "react-router-dom";
import axios from "axios";
import PlacesPage from "./PlacesPage";
import AccountNav from "../components/AccountNav";
import { useToast } from "../components/Toast";

const ProfilePage = () => {
  let { subpage } = useParams();
  const { user, setUser, ready } = useContext(UserContext);
  const [redirect, setRedirect] = useState(false);
  const { showToast } = useToast();

  if (subpage === undefined) {
    subpage = "profile";
  }

  const logOut = async () => {
    try {
      await axios.post("/logout");
      showToast("You have been signed out.");
    } catch (error) {
      console.error("Logout failed:", error);
      showToast("You have been signed out.");
    } finally {
      setUser(null);
      setRedirect(true);
    }
  };

  if (!ready) {
    return (
      <div className="flex h-64 items-center justify-center text-sm font-medium text-slate-500">
        Loading...
      </div>
    );
  }

  if (!user && !redirect) {
    return <Navigate to={"/login"} />;
  }

  if (redirect) {
    return <Navigate to={"/"} />;
  }

  return (
    <div>
      <AccountNav />
      {subpage === "profile" && (
        <main className="mx-auto max-w-full 2xl:max-w-[1400px] 3xl:max-w-[1800px] 4k:max-w-[2400px] pb-10">
          <div className="rounded-3xl bg-slate-900 px-6 py-7 text-white shadow-lg sm:px-8 2xl:px-12 2xl:py-10 4k:px-16 4k:py-14">
            <p className="text-xs sm:text-sm 2xl:text-base 4k:text-xl font-medium text-slate-300">Account settings</p>
            <h1 className="mt-1 text-2xl font-semibold sm:text-3xl 2xl:text-4xl 4k:text-5xl">My profile</h1>
            <p className="mt-2 text-xs sm:text-sm 2xl:text-base 4k:text-xl text-slate-300">Manage your account and access your bookings and places.</p>
          </div>
          <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center gap-4 border-b border-slate-100 p-5 sm:p-6 2xl:p-8 4k:p-12">
              <div className="flex h-14 w-14 sm:h-16 sm:w-16 2xl:h-20 2xl:w-20 4k:h-28 4k:w-28 shrink-0 items-center justify-center rounded-full bg-primary text-xl sm:text-2xl 2xl:text-3xl 4k:text-5xl font-semibold text-white">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <div className="min-w-0">
                <h2 className="truncate text-lg sm:text-xl 2xl:text-3xl 4k:text-4xl font-semibold text-slate-900">{user?.name}</h2>
                <p className="truncate text-xs sm:text-sm 2xl:text-xl 4k:text-2xl text-slate-500">{user?.email}</p>
              </div>
            </div>
            <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6 2xl:p-8 4k:p-12">
              <div>
                <h3 className="text-sm sm:text-base 2xl:text-xl 4k:text-2xl font-semibold text-slate-900">Sign out of your account</h3>
                <p className="mt-1 text-xs sm:text-sm 2xl:text-base 4k:text-xl text-slate-500">You can sign back in at any time.</p>
              </div>
              <button onClick={logOut} className="rounded-xl border border-red-200 bg-white px-5 py-2.5 text-xs sm:text-sm 2xl:text-base 4k:text-xl font-semibold text-red-600 transition hover:bg-red-50 2xl:px-8 2xl:py-3.5">
                Sign out
              </button>
            </div>
          </section>
        </main>
      )}
      {subpage === "places" && <PlacesPage />}
    </div>
  );
};

export default ProfilePage;

