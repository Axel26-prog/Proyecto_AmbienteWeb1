import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const MENU_OPTIONS = [
    {
        key: "activas",
        title: "Subastas",
        subtitle: "Activas",
        route: "/subastas",
    },
    {
        key: "inactivas",
        title: "Subastas",
        subtitle: "Finalizadas",
        route: "/subastas-inactivas",
    },
    {
        key: "objetos",
        title: "Objetos",
        subtitle: "Subastables",
        route: "/objetos",
    },

];

export default function SubastaMenuBar() {
    const navigate = useNavigate();
    const location = useLocation();

    const getIsActive = (route) => {
        return location.pathname === route;
    };

    return (
        <nav className="border-t border-b border-[#845b34]/40 bg-white">
            <div className="mx-auto flex w-full max-w-6xl items-end justify-center gap-16 overflow-x-auto px-6 py-4">
                {MENU_OPTIONS.map((item) => {
                    const isActive = getIsActive(item.route);

                    return (
                        <button
                            key={item.key}
                            type="button"
                            onClick={() => navigate(item.route)}
                            className="relative flex min-w-[160px] flex-col items-center text-center"
                        >
                            <span className="font-[Montserrat] text-xs text-[#5b3717]">
                                {item.description}
                            </span>

                            <span
                                className={[
                                    "mt-1 font-[Georgia] text-2xl font-bold leading-none",
                                    isActive ? "text-[#e8a96e]" : "text-[#5b3717]",
                                ].join(" ")}
                            >
                                {item.title}
                            </span>

                            <span
                                className={[
                                    "font-[Georgia] text-2xl font-bold leading-none",
                                    isActive ? "text-[#e8a96e]" : "text-[#5b3717]",
                                ].join(" ")}
                            >
                                {item.subtitle}
                            </span>

                            <span
                                className={[
                                    "absolute -bottom-3 h-[4px] w-20 rounded-full transition-all",
                                    isActive ? "bg-[#e8a96e]" : "opacity-0",
                                ].join(" ")}
                            />
                        </button>
                    );
                })}
            </div>
        </nav>
    );
}