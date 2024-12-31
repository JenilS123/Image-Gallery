import React, { useContext, useState } from "react";
import { UserContext } from "./UserContext";
import { Navigate, useParams } from "react-router-dom";
import axios from "axios";
import PlacesPage from "./PlacesPage";
import AccountNav from "../components/AccountNav";

const ProfilePage = () => {
  let { subpage } = useParams();
  const { user, setUser, ready } = useContext(UserContext);
  const [redirect, setRedirect] = useState(false);

  if (subpage === undefined) {
    subpage = "profile";
  }
  const logOut = async () => {
    try {
      await axios.post("/logout");
      setRedirect(true);
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (!user && ready && !redirect) {
    return "Loading.....";
  }
  if (!user && redirect) {
    return <Navigate to={"/login"} />;
  }

  if (redirect) {
    return <Navigate to={"/"} />;
  }

  return (
    <>
      <div>
        <AccountNav />
        {subpage === "profile" && (
          <div className="text-center max-w-lg mx-auto">
            Logged in as {user?.name} ({user?.email})<br />
            <button onClick={logOut} className="max-w-sm  mt-2 primary">
              Logout
            </button>
          </div>
        )}
        {subpage === "places" && <PlacesPage />}
      </div>
    </>
  );
};

export default ProfilePage;
