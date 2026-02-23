import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Layout from "./components/Layout/Layout";
import { BrandProvider } from "./context/BrandContext";

function App() {
  return (
    <Layout>
      <div className="mx-auto w-full max-w-6xl px-4 py-10">
        <h1 className="font-[Georgia] text-5xl font-bold text-[#5b3717]">
          Colecciones
        </h1>
        <p className="mt-2 font-[Montserrat] text-sm text-[#845b34]/80">
          Aquí irá tu grid de subastas.
        </p>
      </div>
    </Layout>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrandProvider>
      <App />
    </BrandProvider>
  </React.StrictMode>
);

