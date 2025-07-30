import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Navigation from "../components/Navigation";
import SecondaryNav from "../components/SecondaryNav";
import  Footer  from "../components/Footer";
export const WebLayout = () => {
  return (
    <div>
      {/* <Header /> */}
      <Navigation />
      <SecondaryNav />
      <div className="lg:container m-auto">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};
