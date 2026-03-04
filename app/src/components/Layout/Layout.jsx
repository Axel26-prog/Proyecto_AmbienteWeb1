import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import BrandMenuBar from "./BrandMenuBar"; 

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f7f7f7]">
      <Header />
      <BrandMenuBar /> 
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}