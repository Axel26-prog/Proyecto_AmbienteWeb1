import { Link } from "react-router-dom";
import React, { useState } from "react";
import logo from "../../assets/Logo/Logo.png";

export default function Header() {
  const [catOpen, setCatOpen] = useState(false);

  return (
    <header className="bg-white">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-5">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img src={logo} alt="CrownTime" className="h-20 w-auto object-contain" />
        </Link>

        {/* Categorías (dropdown principal) */}
        <div
          className="relative z-50"
          onMouseLeave={() => setCatOpen(false)}
        >
          <button
            onClick={() => setCatOpen(!catOpen)}
            className="flex items-center gap-2 rounded-full border border-[#845b34]/30 bg-white px-6 py-3 font-[Montserrat] text-sm font-semibold text-[#5b3717]"
          >
            Categorías ▾
          </button>

          {catOpen && (
            <div className="absolute right-0 top-full mt-2 w-64 rounded-md border border-[#845b34]/20 bg-white shadow-lg overflow-hidden">
              {/* <Link
                to="/objetos"
                className="block px-4 py-3 text-sm text-[#5b3717] hover:bg-[#e8a96e]/20"
                onClick={() => setCatOpen(false)}
              >
                Ver todas las subastas
              </Link> */}

              {/* <div className="h-px bg-[#845b34]/10" /> */}

              
              <Link
                to="/objetos?categoria=lujo"
                className="block px-4 py-3 text-sm text-[#5b3717] hover:bg-[#e8a96e]/20"
                onClick={() => setCatOpen(false)}
              >
                Mantenimiento de Relojes
              </Link>

              <Link
                to="/objetos?categoria=coleccion"
                className="block px-4 py-3 text-sm text-[#5b3717] hover:bg-[#e8a96e]/20"
                onClick={() => setCatOpen(false)}
              >
                Mantenimiento de Usuarios
              </Link>

              
            </div>
          )}
        </div>
      </div>

      {/* Línea */}
      <div className="h-[3px] w-full bg-[#845b34]/70" />
    </header>
  );
}