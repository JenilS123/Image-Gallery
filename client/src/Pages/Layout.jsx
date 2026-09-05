import React from "react";
import Header from "../components/Header";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50 text-slate-900 selection:bg-primary/20">
      <Header />
      <div className="flex-1 w-full px-4 sm:px-6 md:px-8 lg:px-10 2xl:px-16 3xl:px-20 4k:px-28 py-4 sm:py-6">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;

