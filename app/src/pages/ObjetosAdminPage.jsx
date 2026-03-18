import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  getRelojes,
  getRelojDetalle,
  cambiarActivo,
} from "@/services/ObjetoServices";

export default function ObjetosAdminPage() {
  const [relojes, setRelojes] = useState([]);
  const [detalle, setDetalle] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    cargarRelojes();
  }, []);

  const cargarRelojes = async () => {
    try {
      const data = await getRelojes();
      setRelojes(data);
    } catch (error) {
      console.error("Error cargando relojes", error);
    }
  };

  const verDetalle = async (id, estado) => {
    if (!id || estado === "eliminado") return;

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

  const cambiarEstado = async (id) => {
    if (!confirm("¿Desea cambiar el estado de este objeto?")) return;

    try {
      await cambiarActivo(id);
      cargarRelojes();
    } catch (error) {
      console.error("Error cambiando estado", error);
    }
  };

  return (
    <div className="p-6 font-[Montserrat]">
      <h1 className="text-2xl mb-4 font-bold font-[Georgia] text-[#845b34]">
        Administración de Objetos Subastables
      </h1>

      <div className="bg-white shadow rounded-lg overflow-x-auto border border-[#845b34]">
        <table className="w-full">
          <thead className="bg-[#845b34] text-[#e8a96e] font-[Georgia] font-bold">
            <tr>
              <th className="p-3 text-left">Modelo</th>
              <th className="p-3 text-left">Marca</th>
              <th className="p-3 text-left">Condición</th>
              <th className="p-3 text-left">Precio Estimado</th>
              <th className="p-3 text-left">Estado</th>
              <th className="p-3 text-left">Acciones</th>
            </tr>
          </thead>

          <tbody className="text-[#5b3717]">
            {relojes.map((reloj) => (
              <tr key={reloj.id_reloj} className="border-t border-[#845b34]/20">
                <td className="p-3">{reloj.modelo}</td>
                <td className="p-3">{reloj.marca}</td>
                <td className="p-3">{reloj.condicion}</td>

                <td className="p-3">
                  ${Number(reloj.precio_estimado || 0).toLocaleString()}
                </td>

                {/* ✅ ESTADO */}
                <td className="p-3">
                  {reloj.estado === "activo" && "Activo"}
                  {reloj.estado === "eliminado" && "Eliminado"}
                </td>

                <td className="p-3 flex gap-2 flex-wrap">
                  {/* DETALLE */}
                  <button
                    disabled={reloj.estado === "eliminado"}
                    className={`px-3 py-1 rounded ${
                      reloj.estado === "eliminado"
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                    style={{
                      backgroundColor: "#845b34",
                      color: "#e8a96e",
                    }}
                    onClick={() => {
                      if (reloj.estado === "eliminado") return;
                      verDetalle(reloj.id_reloj);
                    }}
                  >
                    Detalle
                  </button>

                  {/* EDITAR */}
                  <button
                    disabled={reloj.estado === "eliminado"}
                    className={`px-3 py-1 rounded border ${
                      reloj.estado === "eliminado"
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                    style={{
                      borderColor: "#845b34",
                      color: "#845b34",
                    }}
                    onClick={() => {
                      if (reloj.estado === "eliminado") return;
                      navigate(`/objeto/${reloj.id_reloj}`);
                    }}
                  >
                    Editar
                  </button>

              
                  <button
                    className={`px-3 py-1 rounded text-white ${
                      reloj.estado === "activo" ? "bg-red-500" : "bg-green-600"
                    }`}
                    onClick={() => cambiarEstado(reloj.id_reloj)}
                  >
                    {reloj.estado === "activo" ? "Eliminar" : "Reactivar"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* DETALLE */}
      {detalle && (
        <div className="mt-6 p-4 bg-gray-50 shadow rounded text-gray-900 font-[Montserrat]">
          <h2 className="text-xl font-bold mb-2 font-[Georgia] text-[#845b34]">
            Detalle del Objeto
          </h2>

          <p>
            <strong>Modelo:</strong> {detalle.modelo}
          </p>
          <p>
            <strong>Descripción:</strong> {detalle.descripcion}
          </p>
          <p>
            <strong>Marca:</strong> {detalle.marca}
          </p>
          <p>
            <strong>Condición:</strong> {detalle.condicion}
          </p>
          <p>
            <strong>Año Fabricación:</strong> {detalle.anio_fabricacion}
          </p>
          <p>
            <strong>Precio Estimado:</strong> $
            {Number(detalle.precio_estimado).toLocaleString()}
          </p>
          <p>
            <strong>Categorías:</strong> {detalle.categorias}
          </p>
          <p>
            <strong>Vendedor:</strong> {detalle.usuario_vendedor}
          </p>
        </div>
      )}

      {loading && <p className="mt-2 text-[#845b34]">Cargando detalle...</p>}
    </div>
  );
}
