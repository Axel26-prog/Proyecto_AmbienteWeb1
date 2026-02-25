import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { BrandProvider } from "./context/BrandContext";
import "./index.css";
import Layout from "./components/Layout/Layout";
import UsuariosPages from "./pages/UsuariosPages";
import HomePage from "./pages/HomePage";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrandProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="usuarios" element={<UsuariosPages />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </BrandProvider>
  </StrictMode>
);