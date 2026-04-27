import { Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import React from "react";
import logo from "../../assets/Logo/Logo.png";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-hot-toast";

export default function Header() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickFuera = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuAbierto(false);
      }
    };
    document.addEventListener("mousedown", handleClickFuera);
    return () => document.removeEventListener("mousedown", handleClickFuera);
  }, []);

  const handleLogout = () => {
    logout();
    toast.success("Sesión cerrada");
    navigate("/login");
  };

  const inicial = user?.nombre?.charAt(0).toUpperCase() || "?";

  return (
    <header className="bg-white">
      <div className="flex w-full items-center justify-between px-12 py-5">
        <Link to="/" className="flex items-center">
          <img src={logo} alt="CrownTime" className="h-24 w-auto object-contain" />
        </Link>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuAbierto(!menuAbierto)}
                className="flex items-center gap-3 rounded-full border-2 border-[#845b34] bg-white px-4 py-2 font-[Montserrat] text-sm font-bold text-[#5b3717] transition hover:bg-[#5b3717] hover:text-[#e8a96e]"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#845b34] font-[Georgia] text-base font-bold text-[#e8a96e]">
                  {inicial}
                </span>
                <span className="hidden sm:block">
                  {user?.nombre} {user?.apellido}
                </span>
                <svg
                  className={`h-4 w-4 transition-transform ${menuAbierto ? "rotate-180" : ""}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {menuAbierto && (
                <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-[#845b34]/20 bg-white shadow-lg z-50">
                  <div className="border-b border-[#845b34]/20 px-4 py-3">
                    <p className="font-[Georgia] text-sm font-bold text-[#845b34]">
                      {user?.nombre} {user?.apellido}
                    </p>
                    <p className="font-[Montserrat] text-xs text-[#5b3717]/60">{user?.correo}</p>
                    <span className="mt-1 inline-block rounded-full bg-[#845b34]/10 px-2 py-0.5 font-[Montserrat] text-xs font-semibold text-[#845b34]">
                      {user?.rol}
                    </span>
                  </div>

                  <div className="py-1">
                    {/* Administrador */}
                    {user?.rol === "Administrador" && (
                      <>
                        <Link
                          to="/usuarios"
                          onClick={() => setMenuAbierto(false)}
                          className="flex items-center gap-2 px-4 py-2 font-[Montserrat] text-sm text-[#5b3717] transition hover:bg-[#845b34]/10"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                          Usuarios
                        </Link>
                        <Link
                          to="/reportes"
                          onClick={() => setMenuAbierto(false)}
                          className="flex items-center gap-2 px-4 py-2 font-[Montserrat] text-sm text-[#5b3717] transition hover:bg-[#845b34]/10"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          Reportes
                        </Link>
                      </>
                    )}

                    {/* Vendedor */}
                    {user?.rol === "Vendedor" && (
                      <Link
                        to="/subastas-admin"
                        onClick={() => setMenuAbierto(false)}
                        className="flex items-center gap-2 px-4 py-2 font-[Montserrat] text-sm text-[#5b3717] transition hover:bg-[#845b34]/10"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Mis Subastas
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 px-4 py-2 font-[Montserrat] text-sm text-red-600 transition hover:bg-red-50"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Cerrar sesión
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="rounded-full border-2 border-[#845b34] bg-white px-6 py-3 font-[Montserrat] text-sm font-bold text-[#5b3717] transition hover:bg-[#5b3717] hover:text-[#e8a96e]"
              >
                Iniciar sesión
              </Link>
              <Link
                to="/register"
                className="rounded-full border-2 border-[#845b34] bg-[#845b34] px-6 py-3 font-[Montserrat] text-sm font-bold text-[#e8a96e] transition hover:bg-[#5b3717]"
              >
                Registrarse
              </Link>
            </div>
          )}
        </div>
      </div>
      <div className="h-[3px] w-full bg-[#845b34]/70" />
    </header>
  );
}