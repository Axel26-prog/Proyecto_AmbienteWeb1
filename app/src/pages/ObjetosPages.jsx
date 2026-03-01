import { useEffect, useState } from "react";
import { getRelojes, getRelojDetalle } from "@/services/ObjetoServices";

export default function ObjetosPage() {
  const [relojes, setRelojes] = useState([]);
  const [detalle, setDetalle] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    cargarRelojes();
  }, []);

  const cargarRelojes = async () => {
    try {
      const data = await getRelojes();
      setRelojes(Array.isArray(data) ? data : []); // asegura un array
    } catch (error) {
      console.error("Error cargando relojes", error);
      setRelojes([]); // fallback
    }
  };

  const verDetalle = async (id) => {
    if (!id) return;
    try {
      setLoading(true);
      const data = await getRelojDetalle(id);
      setDetalle(data);
    } catch (error) {
      console.error("Error cargando detalle", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-extrabold mb-8 text-[#5b3717]">
        Relojes Subastables
      </h1>

      {/* GRID DE TARJETAS */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {(relojes || []).map((obj) => (
          <div
            key={obj.id_reloj}
            className="bg-white rounded-lg shadow hover:shadow-xl transition overflow-hidden"
          >
            {/* IMAGEN */}
            <div className="h-56 bg-gray-200 flex items-center justify-center overflow-hidden">
              <img
                src={obj.imagen}
                alt={obj.modelo}
                className="h-full w-full object-cover"
              />
            </div>

            {/* CONTENIDO */}
            <div className="p-5 text-gray-900">
              <h2 className="text-xl font-semibold mb-2">{obj.modelo}</h2>

              <p className="text-base mb-1">
                <strong>Año:</strong> {obj.anio_fabricacion}
              </p>

              <p className="text-base mb-3">
                <strong>Precio Estimado:</strong>{" "}
                <span className="font-bold text-[#845b34]">
                  ${obj.precio_estimado}
                </span>
              </p>

              <button
                onClick={() => verDetalle(obj.id_reloj)}
                className="w-full bg-[#845b34] text-[#fce6c9] py-3 rounded font-semibold hover:brightness-110 transition"
              >
                Ver Detalle
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* DETALLE */}
      {detalle && (
        <div className="mt-8 p-6 bg-white rounded shadow text-gray-900">
          <h2 className="text-2xl font-bold mb-4 text-[#5b3717]">
            Detalle del Reloj
          </h2>

          <p className="text-base mb-1"><strong>Modelo:</strong> {detalle.modelo}</p>
          <p className="text-base mb-1"><strong>Descripción:</strong> {detalle.descripcion}</p>
          <p className="text-base mb-1"><strong>Año:</strong> {detalle.anio_fabricacion}</p>
          <p className="text-base mb-3"><strong>Precio Estimado:</strong> ${detalle.precio_estimado}</p>

          <p className="text-base mb-3">
            <strong>Vendedor:</strong>{" "}
            {detalle.vendedor
              ? `${detalle.vendedor.nombre} ${detalle.vendedor.apellido}`
              : "Sin vendedor"}
          </p>

          {detalle.historial_subastas?.length > 0 ? (
            <div className="mt-4">
              <h3 className="font-bold mb-2 text-lg">Historial de Subastas</h3>
              <ul className="list-disc pl-5 text-base">
                {detalle.historial_subastas.map((sub) => (
                  <li key={sub.id_subasta}>
                    Subasta #{sub.id_subasta} | Inicio: {sub.fecha_inicio} | 
                    Fin: {sub.fecha_fin} | Precio Inicial: ${sub.precio_inicial}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="mt-2 text-gray-500 text-base">No ha participado en subastas.</p>
          )}
        </div>
      )}

      {loading && (
        <p className="mt-4 text-gray-600 text-base font-medium">Cargando detalle...</p>
      )}
    </div>
  );
}