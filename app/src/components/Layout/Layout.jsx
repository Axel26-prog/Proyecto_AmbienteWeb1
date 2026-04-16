import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { getUsuarioActualId } from "../../utils/usuarioActual";

export default function Layout() {
  useEffect(() => {
    getUsuarioActualId();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f7f7]">
      <Header />

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}