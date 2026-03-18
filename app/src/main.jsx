import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import Layout from "./components/Layout/Layout";
import { BrandProvider } from "./context/BrandContext";
import ObjetosAdminPage from "./pages/ObjetosAdminPage";
import UsuariosPages from "./pages/UsuariosPages";
import ObjetosEditPage from "./pages/ObjetosEditPage";
import HomePage from "./pages/HomePage";
import ObjetosPages from "./pages/ObjetosPages"; 
import SubastaPage from "./pages/SubastaPage"; 
import SubastaDetallePage from "./pages/SubastaDetallePage";

import React from "react";



createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrandProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="usuarios" element={<UsuariosPages />} />
            <Route path="objetos" element={<ObjetosPages />} /> 
            <Route path="objetos-admin" element={<ObjetosAdminPage />} />
            <Route path="objeto/:id" element={<ObjetosEditPage />} />
            <Route path="subastas" element={<SubastaPage />} /> 
            <Route path="subastas-inactivas" element={<SubastaPage tipo="inactivas" />} />
            <Route path="subasta/:id" element={<SubastaDetallePage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </BrandProvider>
  </StrictMode>
);