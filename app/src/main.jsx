import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Layout from "./components/Layout/Layout";
import { BrandProvider } from "./context/BrandContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrandProvider>
      <Layout />
    </BrandProvider>
  </StrictMode>
);

