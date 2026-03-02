import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import Layout from "./components/Layout/Layout";
import { BrandProvider } from "./context/BrandContext";
import UsuariosPages from "./pages/UsuariosPages";
import HomePage from "./pages/HomePage";
import ObjetosPages from "./pages/ObjetosPages"; 

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrandProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="usuarios" element={<UsuariosPages />} />
            <Route path="objetos" element={<ObjetosPages />} /> 
          </Route>
        </Routes>
      </BrowserRouter>
    </BrandProvider>
  </StrictMode>
);