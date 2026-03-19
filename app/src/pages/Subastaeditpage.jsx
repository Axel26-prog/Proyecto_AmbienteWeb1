import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getSubastaDetalle, updateSubasta } from "@/services/SubastaServices";

export default function SubastaEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fecha_inicio: "",
    fecha_fin: "",
    precio_inicial: "",
    incremento_minimo: "",
  });
  const [subasta, setSubasta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [errores, setErrores] = useState({});

  useEffect(() => {
    cargar();
  }, []);

  const cargar = async () => {
    try {
      setLoading(true);
      const data = await getSubastaDetalle(id);
      setSubasta(data);

      /* Formatear fechas a datetime-local (YYYY-MM-DDTHH:mm) */
      const toLocal = (fecha) => fecha ? fecha.replace(" ", "T").slice(0, 16) : "";

      setForm({
        fecha_inicio: toLocal(data.fecha_inicio),
        fecha_fin: toLocal(data.fecha_fin),
        precio_inicial: data.precio_inicial,
        incremento_minimo: data.incremento_minimo,
      });
    } catch (e) {
      console.error("Error cargando subasta", e);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrores((prev) => ({ ...prev, [name]: "" }));
  };

  const validar = () => {
    const e = {};
    if (!form.fecha_inicio) e.fecha_inicio = "La fecha de inicio es requerida.";
    if (!form.fecha_fin) e.fecha_fin = "La fecha de cierre es requerida.";
    if (form.fecha_inicio && form.fecha_fin && form.fecha_fin <= form.fecha_inicio)
      e.fecha_fin = "La fecha de cierre debe ser mayor a la de inicio.";
    if (!form.precio_inicial || Number(form.precio_inicial) <= 0)
      e.precio_inicial = "El precio base debe ser mayor a 0.";
    if (!form.incremento_minimo || Number(form.incremento_minimo) <= 0)
      e.incremento_minimo = "El incremento mínimo debe ser mayor a 0.";
    setErrores(e);
    return Object.keys(e).length === 0;
  };

  const handleGuardar = async () => {
    if (!validar()) return;
    setGuardando(true);
    try {
      await updateSubasta({
        id_subasta: Number(id),
        fecha_inicio: form.fecha_inicio.replace("T", " "),
        fecha_fin: form.fecha_fin.replace("T", " "),
        precio_inicial: Number(form.precio_inicial),
        incremento_minimo: Number(form.incremento_minimo),
      });
      alert("Subasta actualizada correctamente");
      navigate("/subastas-admin");
    } catch (e) {
      alert("Error al actualizar: " + e.message);
    } finally {
      setGuardando(false);
    }
  };

  const inputStyle = (campo) => ({
    borderColor: errores[campo] ? "#dc2626" : "#845b34",
  });

  return (
    <div className="p-6 font-[Montserrat] bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold font-[Georgia] text-[#845b34] mb-6">
        Editar Subasta
      </h1>

      {loading ? (
        <p className="text-[#845b34]">Cargando subasta...</p>
      ) : !subasta ? (
        <p className="text-red-600">No se encontró la subasta.</p>
      ) : (
        <div
          className="bg-white shadow-lg rounded-lg border p-6 max-w-xl"
          style={{ borderColor: "#845b34" }}
        >
          {/* Info no editable */}
          <div
            className="mb-5 p-3 rounded text-sm space-y-1"
            style={{ backgroundColor: "#fdf3e7", border: "1px solid #e8a96e", color: "#5b3717" }}
          >
            <p><strong>Objeto:</strong> {subasta.modelo}</p>
            <p>
              <strong>Vendedor:</strong>{" "}
              {subasta.nombre_vendedor
                ? `${subasta.nombre_vendedor} ${subasta.apellido_vendedor}`
                : "Sin vendedor"}
            </p>
            <p><strong>Estado actual:</strong> {subasta.estado}</p>
            <p><strong>Pujas registradas:</strong> {subasta.total_pujas}</p>
          </div>

          {/* Fechas */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-semibold mb-1 text-[#845b34]">
                Fecha y hora inicio *
              </label>
              <input
                type="datetime-local"
                name="fecha_inicio"
                value={form.fecha_inicio}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 text-sm focus:outline-none bg-white text-gray-900"
                style={inputStyle("fecha_inicio")}
              />
              {errores.fecha_inicio && <p className="text-red-600 text-xs mt-1">{errores.fecha_inicio}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1 text-[#845b34]">
                Fecha y hora cierre *
              </label>
              <input
                type="datetime-local"
                name="fecha_fin"
                value={form.fecha_fin}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 text-sm focus:outline-none bg-white text-gray-900"
                style={inputStyle("fecha_fin")}
              />
              {errores.fecha_fin && <p className="text-red-600 text-xs mt-1">{errores.fecha_fin}</p>}
            </div>
          </div>

          {/* Precio e incremento */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-semibold mb-1 text-[#845b34]">
                Precio base ($) *
              </label>
              <input
                type="number"
                name="precio_inicial"
                value={form.precio_inicial}
                onChange={handleChange}
                min="0.01"
                step="0.01"
                className="w-full border rounded px-3 py-2 text-sm focus:outline-none bg-white text-gray-900"
                style={inputStyle("precio_inicial")}
              />
              {errores.precio_inicial && <p className="text-red-600 text-xs mt-1">{errores.precio_inicial}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1 text-[#845b34]">
                Incremento mínimo ($) *
              </label>
              <input
                type="number"
                name="incremento_minimo"
                value={form.incremento_minimo}
                onChange={handleChange}
                min="0.01"
                step="0.01"
                className="w-full border rounded px-3 py-2 text-sm focus:outline-none bg-white text-gray-900"
                style={inputStyle("incremento_minimo")}
              />
              {errores.incremento_minimo && <p className="text-red-600 text-xs mt-1">{errores.incremento_minimo}</p>}
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-3">
            <button
              onClick={handleGuardar}
              disabled={guardando}
              className="px-4 py-2 rounded text-sm font-semibold disabled:opacity-50"
              style={{ backgroundColor: "#845b34", color: "#e8a96e" }}
            >
              {guardando ? "Guardando..." : "Guardar Cambios"}
            </button>
            <button
              onClick={() => navigate("/subastas-admin")}
              className="px-4 py-2 rounded border text-sm font-semibold"
              style={{ borderColor: "#845b34", color: "#845b34" }}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}