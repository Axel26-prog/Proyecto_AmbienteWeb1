import { useEffect, useState, useRef } from "react";
import { getRelojes, getRelojDetalle } from "@/services/ObjetoServices";

export default function ObjetosPage() {
  const [relojes, setRelojes] = useState([]);
  const [detalle, setDetalle] = useState(null);
  const [loading, setLoading] = useState(false);
  const detalleRef = useRef(null);

  useEffect(() => {
    cargarRelojes();
  }, []);

  const cargarRelojes = async () => {
  try {
    const data = await getRelojes();
    console.log("Respuesta API:", data); // 👈 AQUÍ
    setRelojes(data); // temporal para inspeccionar estructura
  } catch (error) {
    console.error("Error cargando relojes", error);
    setRelojes([]);
  }
};

  const verDetalle = async (id) => {
  if (!id) return;
  try {
    setLoading(true);
    const data = await getRelojDetalle(id);
    setDetalle(data);

    // Esperar a que renderice y luego hacer scroll
    setTimeout(() => {
      detalleRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);

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
            <div className="h-56 bg-white flex items-center justify-center overflow-hidden p-4">
  <img
    src={`http://localhost:81/appsubasta/api/uploads/${obj.imagen}`}
    alt={obj.modelo}
    className="max-h-full max-w-full object-contain"
  />
</div>

            {/* CONTENIDO */}
            <div className="p-5 text-gray-900">
              <h2 className="text-xl font-semibold mb-2">{obj.modelo}</h2>

              <p className="text-base mb-1">
                 <strong>Marca:</strong> {obj.marca}
              </p>
            <p className="text-base mb-3">
               <strong>Condición:</strong> {obj.condicion}
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
  <div 
  ref={detalleRef}
  className="mt-8 p-6 bg-white rounded shadow text-gray-900">
    <h2 className="text-2xl font-bold mb-4 text-[#5b3717]">
      {detalle.modelo}
    </h2>

    {/* Imagen */}
    <div className="h-80 bg-white flex items-center justify-center overflow-hidden p-4 mb-6 rounded">
  <img
    src={`http://localhost:81/appsubasta/api/uploads/${detalle.imagen}`}
    alt={detalle.modelo}
    className="max-h-full max-w-full object-contain"
  />
</div>

    {/* Información */}
    <p className="mb-3">
      <strong>Descripción:</strong> {detalle.descripcion}
    </p>

    <p className="mb-1">
      <strong>Marca:</strong> {detalle.marca}
    </p>

    <p className="mb-1">
      <strong>Condición:</strong> {detalle.condicion}
    </p>

    <p className="mb-1">
      <strong>Estado actual:</strong> {detalle.estado ?? "Sin estado"}
    </p>

    <p className="mb-3">
      <strong>Fecha de registro:</strong> {detalle.fecha_registro}
    </p>

    <p>
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