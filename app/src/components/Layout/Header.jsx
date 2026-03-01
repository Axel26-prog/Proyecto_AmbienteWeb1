import { Link } from "react-router-dom";
import React, { useState } from "react";
import { useBrand } from "../../context/BrandContext.jsx";

import logo from "../../assets/Logo/Logo.png";

import RolexAmarillo from "../../assets/Marcas/RolexAmarillo.png";
import RolexCafe from "../../assets/Marcas/RolexCafe.png";

import PatekPhilippeAmarillo from "../../assets/Marcas/PatekPhilippeAmarillo.png";
import PatekPhilippeCafe from "../../assets/Marcas/PatekPhilippeCafe.png";

import CartierAmarillo from "../../assets/Marcas/CartierAmarillo.png";
import CartierCafe from "../../assets/Marcas/CartierCafe.png";

import AudemarsPiguetAmarillo from "../../assets/Marcas/AudemarsPiguetAmarillo.png";
import AudemarsPiguetCafe from "../../assets/Marcas/AudemarsPiguetCafe.png";

import UlysseNardinAmarillo from "../../assets/Marcas/UlysseNardinAmarillo.png";
import UlysseNardinCafe from "../../assets/Marcas/UlysseNardinCafe.png";

import FranckMullerAmarillo from "../../assets/Marcas/FrankMullerAmarillo.png";
import FranckMullerCafe from "../../assets/Marcas/FrankMullerCafe.png";

function normalizeName(name = "") {
  return name.toLowerCase().replace(/\s+/g, " ").trim();
}

/** MAPA DE LOGOS */
const BRAND_LOGOS = {
  rolex: { active: RolexAmarillo, inactive: RolexCafe },
  "patek philippe": { active: PatekPhilippeAmarillo, inactive: PatekPhilippeCafe },
  cartier: { active: CartierAmarillo, inactive: CartierCafe },
  "audemars piguet": { active: AudemarsPiguetAmarillo, inactive: AudemarsPiguetCafe },
  "ulysse nardin": { active: UlysseNardinAmarillo, inactive: UlysseNardinCafe },
  "franck muller": { active: FranckMullerAmarillo, inactive: FranckMullerCafe },
};

/* ========================= */
/*   MENU DE MARCAS          */
/* ========================= */

function BrandMenuBar() {
  const { brands, activeBrand, setActiveBrand } = useBrand();

  return (
    <nav className="border-t border-[#845b34]/20 bg-white">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-center gap-12 overflow-x-auto px-4 py-6">
        {brands.map((b) => {
          const isActive = activeBrand === b.key;
          const normalized = normalizeName(b.name);
          const logoSet = BRAND_LOGOS[normalized];

          return (
            <button
              key={b.key}
              onClick={() => setActiveBrand(b.key)}
              className="group relative flex shrink-0 flex-col items-center gap-3 transition"
            >
              <img
                src={
                  logoSet
                    ? isActive
                      ? logoSet.active
                      : logoSet.inactive
                    : RolexCafe
                }
                alt={b.name}
                className="h-12 w-auto object-contain transition-transform duration-200 group-hover:scale-110"
                draggable="false"
              />

              <span
                className={`font-[Montserrat] text-sm font-semibold transition-colors ${
                  isActive ? "text-[#e8a96e]" : "text-[#5b3717]"
                }`}
              >
                {b.name}
              </span>

              <span
                className={`absolute -bottom-2 h-[3px] w-14 rounded-full transition-all duration-300 ${
                  isActive
                    ? "bg-[#e8a96e] opacity-100"
                    : "bg-[#e8a96e] opacity-0 group-hover:opacity-60"
                }`}
              />
            </button>
          );
        })}
      </div>
    </nav>
  );
}

/* ========================= */
/*        HEADER             */
/* ========================= */

export default function Header() {
  const [catOpen, setCatOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <header className="bg-white">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-5">
        
        {/* LOGO */}
        <Link to="/" className="flex items-center">
          <img
            src={logo}
            alt="CrownTime"
            className="h-20 w-auto object-contain"
          />
        </Link>

        {/* BOTÓN CATEGORÍAS */}
        <button
          type="button"
          onClick={() => setCatOpen(!catOpen)}
          className="flex items-center gap-2 rounded-full border border-[#845b34]/30 bg-white px-6 py-3 font-[Montserrat] text-sm font-semibold text-[#5b3717] shadow-sm hover:bg-[#845b34]/5 transition"
        >
          Categorías
          <span className="text-[#845b34]">▾</span>
        </button>

        {/* LINKS DERECHA */}
        <div className="flex items-center gap-6">
          
          {/* DROPDOWN */}
          <div
        className="relative hidden sm:block z-50"
        onMouseLeave={() => setUserMenuOpen(false)}
          >
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="font-[Montserrat] text-sm font-semibold text-[#5b3717] hover:text-[#e8a96e] transition"
            >
              Gestion ▾
            </button>

            {userMenuOpen && (
             <div className="absolute right-0 top-full w-56 rounded-md border border-[#845b34]/20 bg-white shadow-lg z-50">
                <Link
                  to="/usuarios"
                  className="block px-4 py-3 font-[Montserrat] text-sm text-[#5b3717] hover:bg-[#845b34]/5"
                  onClick={() => setUserMenuOpen(false)}
                >
                  Gestión de Usuarios
                </Link>

                <Link
                  to="/objetos"
                  className="block px-4 py-3 font-[Montserrat] text-sm text-[#5b3717] hover:bg-[#845b34]/5"
                  onClick={() => setUserMenuOpen(false)}
                >
                  Objetos Subastables
                </Link>
              </div>
            )}
          </div>

          <Link
            to="/acerca"
            className="hidden font-[Montserrat] text-sm font-semibold text-[#5b3717] hover:text-[#e8a96e] sm:inline"
          >
            Acerca de
          </Link>

          <Link
            to="/login"
            className="rounded-md bg-[#5b3717] px-6 py-3 font-[Montserrat] text-sm font-bold text-[#e8a96e] shadow-sm hover:brightness-110 transition"
          >
            Iniciar Sesión
          </Link>

        </div>
      </div>

      <div className="h-[3px] w-full bg-[#845b34]/70" />

      <BrandMenuBar />
    </header>
  );
}