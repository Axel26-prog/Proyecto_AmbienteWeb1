import relojSubasta from "../assets/Home/subastaReloj_Home.avif";
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="relative w-full h-screen flex items-center justify-center text-center overflow-hidden">
      
      {/* Fondo */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${relojSubasta})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "brightness(0.45)",
        }}
      />

      {/* Contenido */}
      <div className="relative z-10 px-4 max-w-2xl text-white">
        <h1
          className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 drop-shadow-lg"
          style={{ fontFamily: "Montserrat" }}
        >
          Crown Time Collective
        </h1>

        <p
          className="text-lg md:text-xl text-white/90 mb-8 drop-shadow"
          style={{ fontFamily: "Georgia" }}
        >
          Explora relojes de lujo nuevos, usados y de colección.
          Participa en subastas exclusivas y adquiere piezas únicas.
        </p>

        <div className="flex justify-center gap-6">
          <Link
            to="/objetos"
            className="px-7 py-3 rounded-lg font-semibold shadow-lg transition hover:opacity-90"
            style={{
              backgroundColor: "#e8a96e",
              color: "#5b3717",
              fontFamily: "Montserrat",
            }}
          >
            Ver Subastas
          </Link>

          <Link
            to="/usuarios"
            className="px-7 py-3 rounded-lg font-semibold shadow-lg transition hover:opacity-90"
            style={{
              backgroundColor: "#5b3717",
              color: "#e8a96e",
              fontFamily: "Montserrat",
            }}
          >
            Iniciar Sesión
          </Link>
        </div>
      </div>

    </div>
  );
}