import { Link } from "react-router-dom";
import React from "react";
import logo from "../../assets/Logo/Logo.png";

export default function Header() {
  return (
    <header className="bg-white">

      <div className="flex w-full items-center justify-between px-12 py-5">
        
        {/* Logo izquierda */}
        <Link to="/" className="flex items-center">
          <img
            src={logo}
            alt="CrownTime"
            className="h-24 w-auto object-contain"
          />
        </Link>

        {/* Botón derecha */}
        <Link
          to="/usuarios"
          className="rounded-full border-2 border-[#845b34] bg-white px-8 py-3 font-[Montserrat] text-base font-bold text-[#5b3717] transition hover:bg-[#5b3717] hover:text-[#e8a96e]"
        >
          Ver Usuarios
        </Link>

      </div>

      {/* Línea */}
      <div className="h-[3px] w-full bg-[#845b34]/70" />

    </header>
  );
}