import { Link } from "react-router-dom";
import React, { useState } from "react";
import BrandMenuBar from "../Layout/BrandMenuBar";

import logo from "../../assets/Logo/Logo.png";

export default function Header() {
  const [catOpen, setCatOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <header className="bg-white">

      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-5">

        <Link to="/" className="flex items-center">
          <img src={logo} alt="CrownTime" className="h-20 w-auto object-contain" />
        </Link>

        <button
          onClick={() => setCatOpen(!catOpen)}
          className="flex items-center gap-2 rounded-full border border-[#845b34]/30 bg-white px-6 py-3 font-[Montserrat] text-sm font-semibold text-[#5b3717]"
        >
          Categorías ▾
        </button>

        {/* GESTION NO TOCADO */}
        <div className="flex items-center gap-6">

          <div
            className="relative hidden sm:block z-50"
            onMouseLeave={() => setUserMenuOpen(false)}
          >
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="font-[Montserrat] text-sm font-semibold text-[#5b3717]"
            >
              Gestion ▾
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 top-full w-56 rounded-md border border-[#845b34]/20 bg-white shadow-lg">
                <Link
                  to="/usuarios"
                  className="block px-4 py-3 text-sm text-[#5b3717]"
                >
                  Gestión de Usuarios
                </Link>

                <Link
                  to="/objetos"
                  className="block px-4 py-3 text-sm text-[#5b3717]"
                >
                  Objetos Subastables
                </Link>
              </div>
            )}
          </div>

        
        </div>
      </div>

      <div className="h-[3px] w-full bg-[#845b34]/70" />

      {/* MENU DE MARCAS */}
      <BrandMenuBar />

    </header>
  );
}