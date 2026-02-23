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

function CategoriesModal({ open, onClose }) {
    const { brands, setActiveBrand } = useBrand();
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[100]">
            <button
                className="absolute inset-0 bg-black/40"
                onClick={onClose}
                aria-label="Cerrar categorías"
            />
            <div className="absolute inset-x-0 top-0 mx-auto w-full max-w-6xl">
                <div className="m-4 rounded-2xl bg-white shadow-2xl ring-1 ring-black/5">
                    <div className="flex items-center justify-between border-b border-[#845b34]/15 px-6 py-5">
                        <h2 className="font-[Montserrat] text-3xl font-bold text-[#5b3717]">
                            Categorías
                        </h2>
                        <button
                            onClick={onClose}
                            className="rounded-xl px-3 py-2 text-2xl text-[#845b34] hover:bg-[#845b34]/10"
                            aria-label="Cerrar"
                        >
                            ×
                        </button>
                    </div>

                    <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2 lg:grid-cols-3">
                        {brands.map((b) => (
                            <button
                                key={b.key}
                                onClick={() => {
                                    setActiveBrand(b.key);
                                    onClose();
                                }}
                                className="group relative overflow-hidden rounded-2xl border border-[#845b34]/15 text-left shadow-sm transition hover:shadow-md"
                            >
                                <div className="absolute inset-0">
                                    {b.image ? (
                                        <img src={b.image} alt="" className="h-full w-full object-cover" />
                                    ) : (
                                        <div className="h-full w-full bg-gradient-to-br from-[#845b34] to-[#5b3717]" />
                                    )}
                                    <div className="absolute inset-0 bg-black/35 group-hover:bg-black/25 transition" />
                                </div>

                                <div className="relative flex min-h-[120px] items-center justify-between gap-4 p-5">
                                    <div>
                                        <div
                                            className="font-[Georgia] text-2xl font-bold leading-tight text-white"
                                            style={{ whiteSpace: "pre-line" }}
                                        >
                                            {b.short}
                                        </div>
                                        <div className="mt-2 font-[Montserrat] text-sm font-semibold text-white/85">
                                            Ver subastas →
                                        </div>
                                    </div>

                                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full ring-1 ring-white/25">
                                        {b.image ? (
                                            <img src={b.image} alt="" className="h-full w-full object-cover" />
                                        ) : (
                                            <div className="h-full w-full bg-white/10" />
                                        )}
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center justify-end border-t border-[#845b34]/15 px-6 py-4">
                        <button
                            onClick={onClose}
                            className="rounded-xl border border-[#845b34]/20 px-4 py-2 font-[Montserrat] font-semibold text-[#845b34] hover:bg-[#845b34]/10"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function BrandMenuBar() {
    const { brands, activeBrand, setActiveBrand } = useBrand();

    return (
        <nav className="border-t border-[#845b34]/15 bg-white">
            <div className="mx-auto flex w-full max-w-6xl items-center justify-center gap-10 overflow-x-auto px-4 py-5">
                {brands.map((b) => {
                    const isActive = activeBrand === b.key;
                    return (
                        <button
                            key={b.key}
                            onClick={() => setActiveBrand(b.key)}
                            className="group relative flex shrink-0 flex-col items-center gap-2 px-2"
                        >
                            {/* espacio para ícono/logo de marca */}
                            <div className="grid h-10 w-10 place-items-center rounded-full border border-[#845b34]/20 bg-white/80">
                                <span
                                    className={[
                                        "text-xs font-[Montserrat] font-bold tracking-wider transition-colors",
                                        isActive ? "text-[#e8a96e]" : "text-[#845b34]/70",
                                    ].join(" ")}
                                >
                                    {b.name === "Rolex"
                                        ? "R"
                                        : b.name === "Cartier"
                                            ? "C"
                                            : b.name === "Patek Philippe"
                                                ? "PP"
                                                : b.name === "Audemars Piguet"
                                                    ? "AP"
                                                    : b.name === "Ulysse Nardin"
                                                        ? "UN"
                                                        : "FM"}
                                </span>
                            </div>

                            <div
                                className={[
                                    "text-center font-[Montserrat] text-sm font-semibold leading-snug transition-colors",
                                    isActive ? "text-[#e8a96e]" : "text-[#5b3717]",
                                ].join(" ")}
                                style={{ whiteSpace: "pre-line" }}
                            >
                                {b.short}
                            </div>

                            <span
                                className={[
                                    "absolute -bottom-2 h-[3px] w-10 rounded-full transition-all",
                                    isActive
                                        ? "bg-[#e8a96e] opacity-100"
                                        : "bg-[#e8a96e] opacity-0 group-hover:opacity-60",
                                ].join(" ")}
                            />
                        </button>
                    );
                })}
            </div>
        </nav>
    );
}

export default function Header() {
    const [catOpen, setCatOpen] = useState(false);

    // TODO: pon tu logo aquí (ruta en /src/assets o /public)
    const logoSrc = ""; // ejemplo: "/logo.png" (si está en /public)

    return (
        <header className="bg-white">
            <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-4">
                <a href="#" className="flex items-center gap-3">
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
                </a>

                <button
                    onClick={() => setCatOpen(true)}
                    className="flex items-center gap-3 rounded-full border border-[#845b34]/30 bg-white px-5 py-2.5 font-[Montserrat] text-sm font-semibold text-[#5b3717] shadow-sm hover:bg-[#845b34]/5"
                >
                    Categorías <span className="text-[#845b34]">▾</span>
                </button>

                <div className="flex items-center gap-3">
                    <a
                        href="#"
                        className="hidden font-[Montserrat] text-sm font-semibold text-[#5b3717] hover:text-[#e8a96e] sm:inline"
                    >
                        Acerca de
                    </a>
                    <a
                        href="#"
                        className="rounded-md bg-[#5b3717] px-5 py-2.5 font-[Montserrat] text-sm font-bold text-[#e8a96e] shadow-sm hover:brightness-110"
                    >
                        Iniciar Sesión
                    </a>
                </div>
            </div>

            <div className="h-[2px] w-full bg-[#845b34]/70" />
            <BrandMenuBar />

            <CategoriesModal open={catOpen} onClose={() => setCatOpen(false)} />
        </header>
    );
}