import { useEffect, useState, useRef } from "react";
import { getRelojes, getRelojDetalle } from "@/services/ObjetoServices";
import BrandMenuBar from "../components/Layout/BrandMenuBar";

//se importan los hooks useEffect y useState para el manejo del estado de la pagina
export default function ObjetosPage() {
  const [relojes, setRelojes] = useState([]);
  const [detalle, setDetalle] = useState(null);
  const [loading, setLoading] = useState(false); //indica si está cargando la informacion
  const detalleRef = useRef(null);

  const relojRefs = useRef({}); //guarda la referencia del elemento y hace scroll
  const [relojSeleccionado, setRelojSeleccionado] = useState(null); //id del reloj que el usuario selecciono

  useEffect(() => {
    cargarRelojes();
  }, []);

  //llama al servicio de getRelojes
  const cargarRelojes = async () => {
    try {
      const data = await getRelojes();
      console.log("Respuesta API:", data);
      setRelojes(data); //guarda la lista de relojes
    } catch (error) {
      console.error("Error cargando relojes", error);
      setRelojes([]);
    }
  };

  //llama al servicio getRelojDetalle
  const verDetalle = async (id) => {
    if (!id) return;

    try {
      setLoading(true);
      setRelojSeleccionado(id); //id seleccionado que se guarda

      const data = await getRelojDetalle(id);
      setDetalle(data); //información completa del reloj seleccionado

      setTimeout(() => {
        detalleRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (error) {
      console.error("Error cargando detalle", error);
    } finally {
      setLoading(false);
    }
  };

  //accion de volver, hace el scroll hacia la tarjeta seleccionada
  const volverAlReloj = () => {
    if (relojSeleccionado && relojRefs.current[relojSeleccionado]) {
      relojRefs.current[relojSeleccionado].scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };
  const categorias = Array.isArray(detalle?.categorias)
  ? detalle.categorias.map((cat) =>
      typeof cat === "object" ? cat.nombre : cat
    )
  : typeof detalle?.categorias === "string"
    ? detalle.categorias.split(", ")
    : [];

  return (
    <div className="bg-gray-100 min-h-screen font-[Montserrat]">
      <BrandMenuBar />

      <div className="p-6">
        {/* TÍTULO */}
        <h1
          className="text-3xl font-bold mb-8 text-[#845b34]"
          style={{ fontFamily: "Georgia" }}
        >
          Relojes Subastables
        </h1>

        {/* GRID */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {(relojes || []).map((obj) => (
            <div
              key={obj.id_reloj}
              ref={(el) => (relojRefs.current[obj.id_reloj] = el)}
              className={`bg-white rounded-lg transition overflow-hidden
                ${
                  relojSeleccionado === obj.id_reloj
                    ? "ring-4 ring-[#e8a96e] shadow-2xl scale-[1.03]"
                    : "shadow hover:shadow-xl"
                }`}
            >
              {/* IMAGEN */}
              <div className="h-56 bg-white flex items-center justify-center overflow-hidden p-4">
                <img
                  src={`http://localhost:81/appsubasta/api/uploads/${obj.imagen}`}
                  alt={obj.modelo}
                  className="max-h-full max-w-full object-contain"
                />
              </div>

              {/* CONTENIDO */}
              <div className="p-5 text-gray-900 font-[Montserrat]">
                <h2
                  className="text-xl font-bold mb-2 text-[#845b34]"
                  style={{ fontFamily: "Georgia" }}
                >
                  {obj.modelo}
                </h2>

                <p className="text-base mb-1">
                  <strong style={{ fontFamily: "Georgia" }}>Marca:</strong>{" "}
                  <span style={{ fontFamily: "Montserrat, sans-serif" }}>
                    {obj.marca}
                  </span>
                </p>

                <p className="text-base mb-3">
                  <strong style={{ fontFamily: "Georgia" }}>Condición:</strong>{" "}
                  <span style={{ fontFamily: "Montserrat, sans-serif" }}>
                    {obj.condicion}
                  </span>
                </p>

                <button
                  onClick={() => verDetalle(obj.id_reloj)}
                  className="w-full bg-[#845b34] text-[#e8a96e] py-3 rounded font-semibold hover:brightness-110 transition"
                >
                  Ver Detalle
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* DETALLE */}
        {detalle && (
          <div
            ref={detalleRef}
            className="mt-8 p-6 bg-white rounded shadow font-[Montserrat] text-[black]"
          >
            <div className="flex justify-between items-center mb-6">
              <h2
                className="text-2xl font-bold text-[#845b34]"
                style={{ fontFamily: "Georgia" }}
              >
                {detalle.modelo}
              </h2>

              <button
                onClick={volverAlReloj}
                className="px-4 py-2 bg-[#845b34] text-[#e8a96e] rounded font-semibold hover:brightness-110 transition"
              >
                ← Volver
              </button>
            </div>

            <div className="h-80 bg-white flex items-center justify-center overflow-hidden p-4 mb-6 rounded">
              <img
                src={`http://localhost:81/appsubasta/api/uploads/${detalle.imagen}`}
                alt={detalle.modelo}
                className="max-h-full max-w-full object-contain"
              />
            </div>

            <p className="mb-3 text-[black]">
              <strong style={{ fontFamily: "Georgia" }}>Descripción:</strong>{" "}
              <span style={{ fontFamily: "Montserrat, sans-serif" }}>
                {detalle.descripcion}
              </span>
            </p>

            <p className="mb-1">
              <strong style={{ fontFamily: "Georgia" }}>Marca:</strong>{" "}
              <span style={{ fontFamily: "Montserrat, sans-serif" }}>
                {detalle.marca}
              </span>
            </p>
            {categorias.length > 0 && (
              <div className="mb-2">
                <strong style={{ fontFamily: "Georgia" }}>Categorías:</strong>
                <div className="flex flex-wrap gap-2 mt-2">
                  {categorias.map((cat, index) => (
                    <span
                      key={index}
                      className="text-xs px-3 py-1 rounded bg-[#845b34]/10 text-[#845b34] font-semibold"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <p className="mb-1">
              <strong style={{ fontFamily: "Georgia" }}>Condición:</strong>{" "}
              <span style={{ fontFamily: "Montserrat, sans-serif" }}>
                {detalle.condicion}
              </span>
            </p>

            <p className="mb-1">
              <strong style={{ fontFamily: "Georgia" }}>Estado actual:</strong>{" "}
              <span style={{ fontFamily: "Montserrat, sans-serif" }}>
                {detalle.estado ?? "Sin estado"}
              </span>
            </p>

            <p className="mb-3">
              <strong style={{ fontFamily: "Georgia" }}>
                Fecha de registro:
              </strong>{" "}
              <span style={{ fontFamily: "Montserrat, sans-serif" }}>
                {detalle.fecha_registro}
              </span>
            </p>

            <p>
              <strong style={{ fontFamily: "Georgia" }}>Vendedor:</strong>{" "}
              <span style={{ fontFamily: "Montserrat, sans-serif" }}>
                {detalle.vendedor
                  ? `${detalle.vendedor.nombre} ${detalle.vendedor.apellido}`
                  : "Sin vendedor"}
              </span>
            </p>

            {/* historial  se obtiene del RelojModel*/}
            {detalle.historial_subastas?.length > 0 ? (
              <div className="mt-4">
                <h3
                  className="font-bold mb-2 text-lg text-[#845b34]"
                  style={{ fontFamily: "Georgia" }}
                >
                  Historial de Subastas
                </h3>

                <ul className="list-disc pl-5 text-base font-[Montserrat]">
                  {detalle.historial_subastas.map((sub) => (
                    <li key={sub.id_subasta}>
                      Subasta #{sub.id_subasta} | Inicio: {sub.fecha_inicio} |
                      Fin: {sub.fecha_fin} | Estado: {sub.estado_subasta}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="mt-2 text-gray-500 text-base">
                No ha participado en subastas.
              </p>
            )}
          </div>
        )}

        {loading && (
          <p className="mt-4 text-gray-600 text-base font-medium">
            Cargando detalle...
          </p>
        )}
      </div>
    </div>
  );
}
