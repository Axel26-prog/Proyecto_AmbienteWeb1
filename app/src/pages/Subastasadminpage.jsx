import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getSubastas,
  getSubastaDetalle,
  createSubasta,
  cancelarSubasta,
  getRelojVendedorByReloj,
} from "@/services/SubastaServices";
import { getRelojes, getUsuario } from "@/services/ObjetoServices";

const ID_USUARIO_PROVISIONAL = 2;

const ESTADO_BADGE = {
  activa:      { bg: "#dcfce7", color: "#16a34a", label: "Activa" },
  "no activa": { bg: "#fef9c3", color: "#ca8a04", label: "No activa" },
  cerrada:     { bg: "#f3f4f6", color: "#6b7280", label: "Cerrada" },
  cancelada:   { bg: "#fee2e2", color: "#dc2626", label: "Cancelada" },
};

function EstadoBadge({ estado }) {
  const s = ESTADO_BADGE[estado?.toLowerCase()] || { bg: "#f3f4f6", color: "#6b7280", label: estado };
  return (
    <span className="px-2 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: s.bg, color: s.color }}>
      {s.label}
    </span>
  );
}

const initialForm = {
  id_reloj: "",
  fecha_inicio: "",
  fecha_fin: "",
  precio_inicial: "",
  incremento_minimo: "",
};

/* Devuelve { puede: bool, razon: string } */
function evaluarEditar(s) {
  const estado = s.estado?.toLowerCase();
  if (estado === "cancelada") return { puede: false, razon: "La subasta está cancelada" };
  if (estado === "cerrada")   return { puede: false, razon: "La subasta ya cerró" };
  const yaInicio = new Date() >= new Date(s.fecha_inicio);
  if (yaInicio)               return { puede: false, razon: "La subasta ya inició" };
  if (Number(s.cantidad_pujas) > 0) return { puede: false, razon: "Tiene pujas registradas" };
  return { puede: true, razon: "" };
}

function evaluarCancelar(s) {
  const estado = s.estado?.toLowerCase();
  if (estado === "cancelada") return { puede: false, razon: "Ya está cancelada" };
  if (estado === "cerrada")   return { puede: false, razon: "La subasta ya cerró" };
  const yaInicio = new Date() >= new Date(s.fecha_inicio);
  if (yaInicio && Number(s.cantidad_pujas) > 0)
    return { puede: false, razon: "Ya inició y tiene pujas" };
  return { puede: true, razon: "" };
}

export default function SubastasAdminPage() {
  const navigate = useNavigate();

  const [subastas, setSubastas] = useState([]);
  const [loadingList, setLoadingList] = useState(false);

  /* Modal detalle */
  const [detalle, setDetalle] = useState(null);
  const [loadingDetalle, setLoadingDetalle] = useState(false);

  /* Modal crear */
  const [modalCrear, setModalCrear] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [errores, setErrores] = useState({});
  const [guardando, setGuardando] = useState(false);
  const [vendedor, setVendedor] = useState(null);
  const [relojesActivos, setRelojesActivos] = useState([]);
  const [relojVendedor, setRelojVendedor] = useState(null);

  useEffect(() => { cargarSubastas(); }, []);

  const cargarSubastas = async () => {
    setLoadingList(true);
    try {
      const data = await getSubastas();
      setSubastas(data || []);
    } catch (e) { console.error(e); }
    finally { setLoadingList(false); }
  };

  const verDetalle = async (id) => {
    setLoadingDetalle(true);
    setDetalle(null);
    try {
      const data = await getSubastaDetalle(id);
      setDetalle(data);
    } catch (e) { console.error(e); }
    finally { setLoadingDetalle(false); }
  };

  const handleCancelar = async (id) => {
    if (!confirm("¿Desea cancelar esta subasta?")) return;
    try {
      await cancelarSubasta(id);
      cargarSubastas();
      if (detalle?.id_subasta === id) setDetalle(null);
    } catch (e) { alert(e.message); }
  };

  const abrirModalCrear = async () => {
    setForm(initialForm);
    setErrores({});
    setRelojVendedor(null);
    setModalCrear(true);
    try {
      const [relojes, u] = await Promise.all([getRelojes(), getUsuario(ID_USUARIO_PROVISIONAL)]);
      setRelojesActivos((relojes || []).filter((r) => r.estado === "activo"));
      setVendedor(u);
    } catch (e) { console.error(e); }
  };

  const cerrarModalCrear = () => {
    setModalCrear(false);
    setForm(initialForm);
    setErrores({});
    setRelojVendedor(null);
    setVendedor(null);
  };

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrores((prev) => ({ ...prev, [name]: "" }));
    if (name === "id_reloj" && value) {
      try {
        const rv = await getRelojVendedorByReloj(value);
        setRelojVendedor(rv);
      } catch { setRelojVendedor(null); }
    }
  };

  const validar = () => {
    const e = {};
    if (!form.id_reloj) e.id_reloj = "Seleccione un objeto.";
    if (!form.fecha_inicio) e.fecha_inicio = "La fecha de inicio es requerida.";
    if (!form.fecha_fin) e.fecha_fin = "La fecha de cierre es requerida.";
    if (form.fecha_inicio && form.fecha_fin && form.fecha_fin <= form.fecha_inicio)
      e.fecha_fin = "La fecha de cierre debe ser mayor a la de inicio.";
    if (!form.precio_inicial || Number(form.precio_inicial) <= 0)
      e.precio_inicial = "El precio base debe ser mayor a 0.";
    if (!form.incremento_minimo || Number(form.incremento_minimo) <= 0)
      e.incremento_minimo = "El incremento mínimo debe ser mayor a 0.";
    if (!relojVendedor)
      e.id_reloj = "No se encontró reloj_vendedor para este objeto.";
    setErrores(e);
    return Object.keys(e).length === 0;
  };

  const handleGuardar = async () => {
    if (!validar()) return;
    setGuardando(true);
    try {
      await createSubasta({
        fecha_inicio: form.fecha_inicio.replace("T", " "),
        fecha_fin: form.fecha_fin.replace("T", " "),
        precio_inicial: Number(form.precio_inicial),
        incremento_minimo: Number(form.incremento_minimo),
        id_reloj_vendedor: relojVendedor.id_reloj_vendedor,
        id_estado_subasta: 1,
      });
      cerrarModalCrear();
      cargarSubastas();
    } catch (e) { alert(e.message); }
    finally { setGuardando(false); }
  };

  return (
    <div className="p-6 font-[Montserrat]">
      {/* Encabezado */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold font-[Georgia] text-[#845b34]">
          Administración de Subastas
        </h1>
        <button
          onClick={abrirModalCrear}
          style={{ backgroundColor: "#845b34", color: "#e8a96e" }}
          className="px-4 py-2 rounded font-semibold hover:opacity-90 transition"
        >
          + Nueva Subasta
        </button>
      </div>

      {/* Tabla */}
      <div className="bg-white shadow rounded-lg overflow-x-auto border border-[#845b34]">
        <table className="w-full">
          <thead className="bg-[#845b34] text-[#e8a96e] font-[Georgia] font-bold">
            <tr>
              <th className="p-3 text-left">#</th>
              <th className="p-3 text-left">Objeto</th>
              <th className="p-3 text-left">Fecha Inicio</th>
              <th className="p-3 text-left">Fecha Cierre</th>
              <th className="p-3 text-left">Precio Base</th>
              <th className="p-3 text-left">Pujas</th>
              <th className="p-3 text-left">Estado</th>
              <th className="p-3 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody className="text-[#5b3717]">
            {loadingList ? (
              <tr><td colSpan={8} className="p-4 text-center text-[#845b34]">Cargando subastas...</td></tr>
            ) : subastas.length === 0 ? (
              <tr><td colSpan={8} className="p-4 text-center text-gray-400">No hay subastas registradas.</td></tr>
            ) : (
              subastas.map((s) => {
                const editar   = evaluarEditar(s);
                const cancelar = evaluarCancelar(s);
                return (
                  <tr key={s.id_subasta} className="border-t border-[#845b34]/20 align-top">
                    <td className="p-3">{s.id_subasta}</td>
                    <td className="p-3">{s.modelo}</td>
                    <td className="p-3">{s.fecha_inicio}</td>
                    <td className="p-3">{s.fecha_fin}</td>
                    <td className="p-3">${Number(s.precio_inicial || 0).toLocaleString()}</td>
                    <td className="p-3">{s.cantidad_pujas}</td>
                    <td className="p-3"><EstadoBadge estado={s.estado} /></td>
                    <td className="p-3">
                      <div className="flex flex-col gap-2 min-w-[120px]">

                        {/* Detalle — siempre activo */}
                        <button
                          onClick={() => verDetalle(s.id_subasta)}
                          className="px-3 py-1 rounded text-sm font-semibold"
                          style={{ backgroundColor: "#845b34", color: "#e8a96e" }}
                        >
                          Detalle
                        </button>

                        {/* Editar — siempre visible, deshabilitado con razón */}
                        <div>
                          <button
                            onClick={() => editar.puede && navigate(`/subasta/editar/${s.id_subasta}`)}
                            disabled={!editar.puede}
                            className="px-3 py-1 rounded border text-sm font-semibold w-full"
                            style={{
                              borderColor: "#845b34",
                              color: editar.puede ? "#845b34" : "#a07850",
                              opacity: editar.puede ? 1 : 0.55,
                              cursor: editar.puede ? "pointer" : "not-allowed",
                            }}
                          >
                            Editar
                          </button>
                          {!editar.puede && (
                            <p className="text-xs mt-0.5 text-center" style={{ color: "#a07850" }}>
                              {editar.razon}
                            </p>
                          )}
                        </div>

                        {}
                        <div>
                          <button
                            onClick={() => cancelar.puede && handleCancelar(s.id_subasta)}
                            disabled={!cancelar.puede}
                            className="px-3 py-1 rounded text-sm font-semibold w-full text-white"
                            style={{
                              backgroundColor: cancelar.puede ? "#ef4444" : "#fca5a5",
                              cursor: cancelar.puede ? "pointer" : "not-allowed",
                            }}
                          >
                            Cancelar
                          </button>
                          {!cancelar.puede && (
                            <p className="text-xs mt-0.5 text-center" style={{ color: "#a07850" }}>
                              {cancelar.razon}
                            </p>
                          )}
                        </div>

                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ── MODAL DETALLE ── */}
      {(detalle || loadingDetalle) && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={(e) => { if (e.target === e.currentTarget) setDetalle(null); }}
        >
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto" style={{ border: "2px solid #845b34" }}>
            <div className="flex items-center justify-between px-6 py-4 rounded-t-lg" style={{ backgroundColor: "#845b34" }}>
              <h2 className="text-xl font-bold font-[Georgia] text-[#e8a96e]">Detalle de Subasta</h2>
              <button onClick={() => setDetalle(null)} className="text-[#e8a96e] hover:opacity-70 text-2xl font-bold leading-none">×</button>
            </div>

            <div className="px-6 py-5 text-[#5b3717] font-[Montserrat]">
              {loadingDetalle ? (
                <p className="text-center py-6 text-[#845b34]">Cargando detalle...</p>
              ) : detalle && (
                <div className="space-y-4">
                  {detalle.imagen && (
                    <div className="flex justify-center">
                      <img
                        src={`http://localhost:81/appsubasta/api/uploads/${detalle.imagen}`}
                        alt={detalle.modelo}
                        className="h-40 object-contain rounded border"
                        style={{ borderColor: "#e8a96e" }}
                      />
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                    <p><span className="font-semibold">Objeto:</span> {detalle.modelo}</p>
                    <p><span className="font-semibold">Marca:</span> {detalle.marca}</p>
                    <p><span className="font-semibold">Condición:</span> {detalle.condicion}</p>
                    <p><span className="font-semibold">Estado:</span> <EstadoBadge estado={detalle.estado} /></p>
                    <p><span className="font-semibold">Fecha Inicio:</span> {detalle.fecha_inicio}</p>
                    <p><span className="font-semibold">Fecha Cierre:</span> {detalle.fecha_fin}</p>
                    <p><span className="font-semibold">Precio Base:</span> ${Number(detalle.precio_inicial).toLocaleString()}</p>
                    <p><span className="font-semibold">Incremento Mín.:</span> ${Number(detalle.incremento_minimo).toLocaleString()}</p>
                    <p><span className="font-semibold">Total Pujas:</span> {detalle.total_pujas}</p>
                    <p>
                      <span className="font-semibold">Vendedor:</span>{" "}
                      {detalle.nombre_vendedor ? `${detalle.nombre_vendedor} ${detalle.apellido_vendedor}` : "Sin vendedor"}
                    </p>
                  </div>
                  {detalle.descripcion && (
                    <div className="text-sm">
                      <p className="font-semibold mb-1">Descripción del objeto:</p>
                      <p className="text-gray-700">{detalle.descripcion}</p>
                    </div>
                  )}
                  {detalle.categorias && (
                    <div className="text-sm">
                      <p className="font-semibold mb-1">Categorías:</p>
                      <div className="flex gap-2 flex-wrap">
                        {detalle.categorias.split(", ").map((cat, i) => (
                          <span key={i} className="px-2 py-1 rounded-full text-xs font-medium"
                            style={{ backgroundColor: "#fdf3e7", border: "1px solid #e8a96e", color: "#845b34" }}>
                            {cat}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex justify-end px-6 py-4" style={{ borderTop: "1px solid #e8a96e" }}>
              <button onClick={() => setDetalle(null)} className="px-4 py-2 rounded text-sm font-semibold"
                style={{ backgroundColor: "#845b34", color: "#e8a96e" }}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL CREAR ── */}
      {modalCrear && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={(e) => { if (e.target === e.currentTarget) cerrarModalCrear(); }}
        >
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" style={{ border: "2px solid #845b34" }}>
            <div className="flex items-center justify-between px-6 py-4 rounded-t-lg" style={{ backgroundColor: "#845b34" }}>
              <h2 className="text-xl font-bold font-[Georgia] text-[#e8a96e]">Nueva Subasta</h2>
              <button onClick={cerrarModalCrear} className="text-[#e8a96e] hover:opacity-70 text-2xl font-bold leading-none">×</button>
            </div>

            <div className="px-6 py-5 space-y-4 text-[#5b3717]">
              {/* Vendedor */}
              <div className="text-sm">
                <strong>Vendedor:</strong>{" "}
                {vendedor ? `${vendedor.nombre} ${vendedor.apellido}` : "Cargando..."}
              </div>

              {/* Objeto */}
              <div>
                <label className="block text-sm font-semibold mb-1">Objeto *</label>
                <select name="id_reloj" value={form.id_reloj} onChange={handleChange}
                  className="w-full border rounded px-3 py-2 text-sm focus:outline-none bg-white"
                  style={{ borderColor: errores.id_reloj ? "#dc2626" : "#845b34" }}>
                  <option value="">-- Seleccione un objeto --</option>
                  {relojesActivos.map((r) => (
                    <option key={r.id_reloj} value={r.id_reloj}>{r.modelo} — {r.marca}</option>
                  ))}
                </select>
                {errores.id_reloj && <p className="text-red-600 text-xs mt-1">{errores.id_reloj}</p>}
                {relojVendedor && (
                  <p className="text-xs mt-1" style={{ color: "#16a34a" }}>
                    ✓ Vendedor: {relojVendedor.nombre} {relojVendedor.apellido}
                  </p>
                )}
              </div>

              {/* Fechas */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Fecha y hora inicio *</label>
                  <input type="datetime-local" name="fecha_inicio" value={form.fecha_inicio} onChange={handleChange}
                    className="w-full border rounded px-3 py-2 text-sm focus:outline-none"
                    style={{ borderColor: errores.fecha_inicio ? "#dc2626" : "#845b34" }} />
                  {errores.fecha_inicio && <p className="text-red-600 text-xs mt-1">{errores.fecha_inicio}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Fecha y hora cierre *</label>
                  <input type="datetime-local" name="fecha_fin" value={form.fecha_fin} onChange={handleChange}
                    className="w-full border rounded px-3 py-2 text-sm focus:outline-none"
                    style={{ borderColor: errores.fecha_fin ? "#dc2626" : "#845b34" }} />
                  {errores.fecha_fin && <p className="text-red-600 text-xs mt-1">{errores.fecha_fin}</p>}
                </div>
              </div>

              {/* Precio e Incremento */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Precio base ($) *</label>
                  <input type="number" name="precio_inicial" value={form.precio_inicial} onChange={handleChange}
                    min="0.01" step="0.01" placeholder="Ej: 5000"
                    className="w-full border rounded px-3 py-2 text-sm focus:outline-none"
                    style={{ borderColor: errores.precio_inicial ? "#dc2626" : "#845b34" }} />
                  {errores.precio_inicial && <p className="text-red-600 text-xs mt-1">{errores.precio_inicial}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Incremento mínimo ($) *</label>
                  <input type="number" name="incremento_minimo" value={form.incremento_minimo} onChange={handleChange}
                    min="0.01" step="0.01" placeholder="Ej: 100"
                    className="w-full border rounded px-3 py-2 text-sm focus:outline-none"
                    style={{ borderColor: errores.incremento_minimo ? "#dc2626" : "#845b34" }} />
                  {errores.incremento_minimo && <p className="text-red-600 text-xs mt-1">{errores.incremento_minimo}</p>}
                </div>
              </div>

              <p className="text-xs" style={{ color: "#845b34" }}>
                La subasta se creará como <strong>activa</strong> inmediatamente.
              </p>
            </div>

            <div className="flex justify-end gap-3 px-6 py-4" style={{ borderTop: "1px solid #e8a96e" }}>
              <button onClick={cerrarModalCrear} className="px-4 py-2 rounded border text-sm font-semibold"
                style={{ borderColor: "#845b34", color: "#845b34" }}>
                Cancelar
              </button>
              <button onClick={handleGuardar} disabled={guardando}
                className="px-4 py-2 rounded text-sm font-semibold disabled:opacity-50"
                style={{ backgroundColor: "#845b34", color: "#e8a96e" }}>
                {guardando ? "Guardando..." : "Crear Subasta"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}