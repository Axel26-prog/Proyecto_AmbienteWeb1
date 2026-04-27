import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import React from "react";

import Layout from "./components/Layout/Layout";
import { BrandProvider } from "./context/BrandContext";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import ObjetosPages from "./pages/ObjetosPages";
import ObjetosAdminPage from "./pages/ObjetosAdminPage";
import ObjetosEditPage from "./pages/ObjetosEditPage";
import UsuariosPages from "./pages/UsuariosPages";
import SubastaPage from "./pages/SubastaPage";
import SubastaDetallePage from "./pages/SubastaDetallePage";
import SubastasAdminPage from "./pages/SubastasAdminPage";
import SubastaEditPage from "./pages/SubastaEditPage";
import PagoPage from "./pages/PagoPage";
import ReportesPage from "./pages/ReportesPage";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <BrandProvider>
        <BrowserRouter>
          <Routes>
            {/* ── Rutas públicas (sin Layout) ─────────────────────── */}
            <Route path="/login"    element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* ── Rutas con Layout ────────────────────────────────── */}
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />

              {/* Cualquier usuario autenticado */}
              <Route element={<ProtectedRoute />}>
                <Route path="objetos"           element={<ObjetosPages />} />
                <Route path="subastas"          element={<SubastaPage />} />
                <Route path="subastas-inactivas" element={<SubastaPage tipo="inactivas" />} />
                <Route path="subasta/:id"       element={<SubastaDetallePage />} />
                <Route path="pago"              element={<PagoPage />} />
                <Route path="reportes"          element={<ReportesPage />} />
              </Route>

              {/* Solo Administrador */}
              <Route element={<ProtectedRoute roles={["Administrador"]} />}>
                <Route path="usuarios"          element={<UsuariosPages />} />
                <Route path="objetos-admin"     element={<ObjetosAdminPage />} />
                <Route path="objeto/:id"        element={<ObjetosEditPage />} />
                <Route path="subasta/editar/:id" element={<SubastaEditPage />} />
              </Route>

              {/* Administrador o Vendedor */}
              <Route element={<ProtectedRoute roles={["Administrador", "Vendedor"]} />}>
                <Route path="subastas-admin"    element={<SubastasAdminPage />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </BrandProvider>
    </AuthProvider>
  </StrictMode>
);