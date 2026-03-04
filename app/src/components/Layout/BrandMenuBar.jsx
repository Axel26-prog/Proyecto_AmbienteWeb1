import React from "react";
import { useBrand } from "../../context/useBrand";

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

import FranckMullerAmarillo from "../../assets/Marcas/FranckMullerAmarillo.png";
import FranckMullerCafe from "../../assets/Marcas/FranckMullerCafe.png";

/** Menú fijo (NO BD) */
const BRAND_MENU = [
    { key: "rolex", name: "Rolex" },
    { key: "patek", name: "Patek Philippe" },
    { key: "cartier", name: "Cartier" },
    { key: "ap", name: "Audemars Piguet" },
    { key: "ulysse", name: "Ulysse Nardin" },
    { key: "franck", name: "Franck Muller" },
];

const BRAND_LOGOS_BY_KEY = {
    rolex: { active: RolexAmarillo, inactive: RolexCafe },
    patek: { active: PatekPhilippeAmarillo, inactive: PatekPhilippeCafe },
    cartier: { active: CartierAmarillo, inactive: CartierCafe },
    ap: { active: AudemarsPiguetAmarillo, inactive: AudemarsPiguetCafe },
    ulysse: { active: UlysseNardinAmarillo, inactive: UlysseNardinCafe },
    franck: { active: FranckMullerAmarillo, inactive: FranckMullerCafe },
};

export default function BrandMenuBar() {
    const { activeBrand, setActiveBrand } = useBrand();

    return (
        <nav className="border-t border-[#845b34]/20 bg-white">
            <div className="mx-auto flex w-full max-w-6xl items-end justify-center gap-12 overflow-x-auto px-4 py-6">
                {BRAND_MENU.map((b) => {
                    const isActive = activeBrand === b.key;
                    const logoSet = BRAND_LOGOS_BY_KEY[b.key];

                    return (
                        <button
                            key={b.key}
                            type="button"
                            onClick={() => setActiveBrand(b.key)}
                            className="group relative flex shrink-0 flex-col items-center gap-3 transition"
                        >
                            <img
                                src={isActive ? logoSet.active : logoSet.inactive}
                                alt={b.name}
                                className="h-12 w-auto object-contain transition-transform duration-200 group-hover:scale-110"
                                draggable="false"
                            />

                            <span
                                className={[
                                    "font-[Montserrat] text-sm font-semibold transition-colors",
                                    isActive ? "text-[#e8a96e]" : "text-[#5b3717]",
                                ].join(" ")}
                            >
                                {b.name}
                            </span>

                            {/* GUION */}
                            <span
                                className={[
                                    "absolute -bottom-2 h-[3px] w-14 rounded-full transition-all duration-300",
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