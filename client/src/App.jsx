import React from "react";
import { Routes, Route } from "react-router-dom";
import LoginPage from "./Pages/LoginPage";
import Layout from "./Pages/Layout";
import IndexPage from "./Pages/IndexPage";
import RegisterPage from "./Pages/RegisterPage";
import axios from "axios";
import { UserContextProvider } from "./Pages/UserContext";
import ProfilePage from "./Pages/ProfilePage";
import PlacesPage from "./Pages/PlacesPage";
import PlaceFormPage from "./Pages/PlaceFormPage";
import InnerPlacePage from "./Pages/InnerPlacePage";
import BookingsPage from "./Pages/BookingsPage";

axios.defaults.baseURL = "http://localhost:8000";
axios.defaults.withCredentials = true;

const App = () => {
  return (
    <>
      <UserContextProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="/" element={<IndexPage />}></Route>
            <Route path="/register" element={<RegisterPage />}></Route>
            <Route path="/login" element={<LoginPage />}></Route>
            <Route path="/account/" element={<ProfilePage />}></Route>
            <Route path="/account/places" element={<PlacesPage />}></Route>
            <Route
              path="/account/places/new"
              element={<PlaceFormPage />}
            ></Route>
            <Route
              path="/account/places/:id"
              element={<PlaceFormPage />}
            ></Route>
            <Route
              path="/innerPlace/:id"
              element={<InnerPlacePage />}
            ></Route>
            <Route
              path="/account/bookings/"
              element={<BookingsPage />}
            ></Route>
          </Route>
        </Routes>
      </UserContextProvider>
    </>
  );
};

export default App;


