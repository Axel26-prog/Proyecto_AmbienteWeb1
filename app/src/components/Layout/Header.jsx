import { Link } from "react-router-dom";
import React, { useState } from "react";
import { useBrand } from "../../context/BrandContext.jsx";

/** Logo placeholder (swap for SVG/logo) */
function BrandLogoMark({ active = false }) {
    return (
        <div
            className={[
                "grid h-10 w-10 place-items-center rounded-xl border transition-colors",
                active ? "border-[#e8a96e]" : "border-[#845b34]/30",
            ].join(" ")}
            aria-hidden="true"
        >
            <span
                className={[
                    "text-lg leading-none transition-colors",
                    active ? "text-[#e8a96e]" : "text-[#845b34]",
                ].join(" ")}
            >
                ♛
            </span>
        </div>
    );
}

export default function Header() {
    const [catOpen, setCatOpen] = useState(false);
    const logoSrc = "";

    return (
        <header className="bg-white">
            <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-4">
                
                {/* LOGO → VA AL HOME */}
                <Link to="/" className="flex items-center gap-3">
                    {logoSrc ? (
                        <img src={logoSrc} alt="CrownTime" className="h-10 w-auto" />
                    ) : (
                        <BrandLogoMark active />
                    )}

                    <div className="leading-tight">
                        <div className="font-[Montserrat] text-sm font-extrabold tracking-[0.18em] uppercase text-[#845b34]">
                            Crowntime
                        </div>
                        <div className="font-[Georgia] text-xs text-[#845b34]/70">
                            collective
                        </div>
                    </div>
                </Link>

                {/* BOTÓN CATEGORÍAS */}
                <button
                    onClick={() => setCatOpen(true)}
                    className="flex items-center gap-3 rounded-full border border-[#845b34]/30 bg-white px-5 py-2.5 font-[Montserrat] text-sm font-semibold text-[#5b3717] shadow-sm hover:bg-[#845b34]/5"
                >
                    Categorías <span className="text-[#845b34]">▾</span>
                </button>

                {/* LINKS DERECHA */}
                <div className="flex items-center gap-3">
                    
                    {/* NUEVO LINK USUARIOS */}
                    <Link
                        to="/usuarios"
                        className="hidden font-[Montserrat] text-sm font-semibold text-[#5b3717] hover:text-[#e8a96e] sm:inline"
                    >
                        Usuarios
                    </Link>

                    <Link
                        to="/acerca"
                        className="hidden font-[Montserrat] text-sm font-semibold text-[#5b3717] hover:text-[#e8a96e] sm:inline"
                    >
                        Acerca de
                    </Link>

                    <Link
                        to="/login"
                        className="rounded-md bg-[#5b3717] px-5 py-2.5 font-[Montserrat] text-sm font-bold text-[#e8a96e] shadow-sm hover:brightness-110"
                    >
                        Iniciar Sesión
                    </Link>
                </div>
            </div>

            <div className="h-[2px] w-full bg-[#845b34]/70" />
        </header>
    );
}