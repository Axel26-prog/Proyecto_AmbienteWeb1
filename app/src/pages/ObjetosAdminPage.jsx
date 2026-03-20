import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import BrandMenuBar from "../components/Layout/BrandMenuBar";

import {
  getRelojes,
  getRelojDetalle,
  cambiarActivo,
  crearReloj,
  getMarcas,
  getCondiciones,
  getCategorias,
  getUsuario,
} from "@/services/ObjetoServices";

const ID_USUARIO_PROVISIONAL = 2;

const initialForm = {
  modelo: "",
  descripcion: "",
  anio_fabricacion: "",
  precio_estimado: "",
  id_marca: "",
  id_condicion: "",
};

export default function ObjetosAdminPage() {
  const [relojes, setRelojes] = useState([]);
  const [detalle, setDetalle] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  /* Modal */
  const [vendedorProvisional, setVendedorProvisional] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [imagen, setImagen] = useState(null);
  const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState([]);
  const [guardando, setGuardando] = useState(false);
  const [errores, setErrores] = useState({});

  /* Catálogos */
  const [marcas, setMarcas] = useState([]);
  const [condiciones, setCondiciones] = useState([]);
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    cargarRelojes();
    cargarCatalogos();
  }, []);

  const cargarRelojes = async () => {
    try {
      const data = await getRelojes();
      setRelojes(data);
    } catch (error) {
      console.error("Error cargando relojes", error);
    }
  };

  const cargarCatalogos = async () => {
    try {
      const [m, c, cat] = await Promise.all([
        getMarcas(),
        getCondiciones(),
        getCategorias(),
      ]);
      setMarcas(m || []);
      setCondiciones(c || []);
      setCategorias(cat || []);
    } catch (error) {
      console.error("Error cargando catálogos", error);
    }
  };

  const verDetalle = async (id) => {
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

  /* ── Modal helpers ── */
  const abrirModal = async () => {
    setForm(initialForm);
    setImagen(null);
    setCategoriasSeleccionadas([]);
    setErrores({});
    setModalAbierto(true);
    try {
      const u = await getUsuario(ID_USUARIO_PROVISIONAL);
      setVendedorProvisional(u);
    } catch (error) {
      console.error("Error cargando vendedor provisional", error);
    }
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setForm(initialForm);
    setImagen(null);
    setCategoriasSeleccionadas([]);
    setErrores({});
    setVendedorProvisional(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrores((prev) => ({ ...prev, [name]: "" }));
  };

  const handleImagen = (e) => {
    setImagen(e.target.files[0]);
    setErrores((prev) => ({ ...prev, imagen: "" }));
  };

  /* Máximo 2 categorías — si ya hay 2, reemplaza la más antigua */
  const toggleCategoria = (idCat) => {
    if (categoriasSeleccionadas.includes(idCat)) {
      setCategoriasSeleccionadas(
        categoriasSeleccionadas.filter((c) => c !== idCat),
      );
    } else {
      if (categoriasSeleccionadas.length >= 2) {
        setCategoriasSeleccionadas([
          ...categoriasSeleccionadas.slice(1),
          idCat,
        ]);
      } else {
        setCategoriasSeleccionadas([...categoriasSeleccionadas, idCat]);
      }
    }
    setErrores((prev) => ({ ...prev, categorias: "" }));
  };

  const validar = () => {
    const nuevosErrores = {};
    if (!form.modelo.trim()) nuevosErrores.modelo = "El modelo es requerido.";
    if (!form.descripcion.trim() || form.descripcion.length < 20)
      nuevosErrores.descripcion = "La descripción debe tener mínimo 20 caracteres.";
    if (!form.anio_fabricacion)
      nuevosErrores.anio_fabricacion = "El año es requerido.";
    if (!form.precio_estimado || isNaN(form.precio_estimado))
      nuevosErrores.precio_estimado = "Ingrese un precio válido.";
    if (!form.id_marca) nuevosErrores.id_marca = "Seleccione una marca.";
    if (!form.id_condicion)
      nuevosErrores.id_condicion = "Seleccione una condición.";
    if (!imagen)
      nuevosErrores.imagen = "Debe seleccionar una imagen.";
    if (categoriasSeleccionadas.length === 0)
      nuevosErrores.categorias = "Debe seleccionar al menos una categoría.";
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleGuardar = async () => {
    if (!validar()) return;
    setGuardando(true);
    try {
      const formData = new FormData();
      formData.append("modelo", form.modelo);
      formData.append("descripcion", form.descripcion);
      formData.append("anio_fabricacion", form.anio_fabricacion);
      formData.append("precio_estimado", form.precio_estimado);
      formData.append("id_marca", form.id_marca);
      formData.append("id_condicion", form.id_condicion);
      formData.append("id_usuario", ID_USUARIO_PROVISIONAL);
      formData.append("categorias", JSON.stringify(categoriasSeleccionadas));

      if (imagen) {
        formData.append("imagen", imagen);
      }

      await crearReloj(formData);
      cerrarModal();
      cargarRelojes();
    } catch (error) {
      console.error("Error creando reloj", error);
    } finally {
      setGuardando(false);
    }
  };

  /* ── Render ── */
  return (

    <div className="bg-gray-100 min-h-screen font-[Montserrat]">
      <BrandMenuBar />

      <div className="p-6">
        {/* Encabezado */}
        <div className="flex items-center justify-between mb-4">
          <h1
            className="text-3xl font-bold text-[#845b34]"
            style={{ fontFamily: "Georgia" }}
          >
            Administración de Objetos Subastables
          </h1>
          <button
            onClick={abrirModal}
            style={{ backgroundColor: "#845b34", color: "#e8a96e" }}
            className="px-4 py-2 rounded font-semibold hover:opacity-90 transition"
          >
            + Agregar Objeto
          </button>
        </div>

        {/* Tabla */}
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
                  <td className="p-3">
                    {reloj.estado === "activo" && "Activo"}
                    {reloj.estado === "eliminado" && "Eliminado"}
                  </td>
                  <td className="p-3 flex gap-2 flex-wrap items-start">
                    <button
                      disabled={reloj.estado === "eliminado"}
                      className={`px-3 py-1 rounded ${reloj.estado === "eliminado" ? "opacity-50 cursor-not-allowed" : ""}`}
                      style={{ backgroundColor: "#845b34", color: "#e8a96e" }}
                      onClick={() => {
                        if (reloj.estado === "eliminado") return;
                        verDetalle(reloj.id_reloj);
                      }}
                    >
                      Detalle
                    </button>

                    <div className="flex flex-col">
                      <button
                        disabled={reloj.estado === "eliminado" || reloj.tiene_subasta_activa == 1}
                        className={`px-3 py-1 rounded border ${reloj.estado === "eliminado" || reloj.tiene_subasta_activa == 1
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                          }`}
                        style={{ borderColor: "#845b34", color: "#845b34" }}
                        onClick={() => {
                          if (reloj.estado === "eliminado" || reloj.tiene_subasta_activa == 1) return;
                          navigate(`/objeto/${reloj.id_reloj}`);
                        }}
                      >
                        Editar
                      </button>
                      {reloj.tiene_subasta_activa == 1 && (
                        <p className="text-xs mt-0.5 text-center" style={{ color: "#a07850" }}>
                          En subasta activa
                        </p>
                      )}
                    </div>

                    <button
                      className={`px-3 py-1 rounded text-white ${reloj.estado === "activo" ? "bg-red-500" : "bg-green-600"}`}
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

        {/* ── MODAL DETALLE ── */}
        {(detalle || loading) && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            onClick={(e) => {
              if (e.target === e.currentTarget) setDetalle(null);
            }}
          >
            <div
              className="bg-white rounded-lg shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto"
              style={{ border: "2px solid #845b34" }}
            >
              <div
                className="flex items-center justify-between px-6 py-4 rounded-t-lg"
                style={{ backgroundColor: "#845b34" }}
              >
                <h2 className="text-xl font-bold font-[Georgia] text-[#e8a96e]">
                  Detalle del Objeto
                </h2>
                <button
                  onClick={() => setDetalle(null)}
                  className="text-[#e8a96e] hover:opacity-70 text-2xl font-bold leading-none"
                >
                  ×
                </button>
              </div>

              <div className="px-6 py-5 text-[#5b3717] font-[Montserrat]">
                {loading ? (
                  <p className="text-center py-6 text-[#845b34]">
                    Cargando detalle...
                  </p>
                ) : (
                  <div className="space-y-3">
                    {detalle.imagen && (
                      <div className="flex justify-center mb-2">
                        <img
                          src={`http://localhost:81/appsubasta/api/uploads/${detalle.imagen}`}
                          alt={detalle.modelo}
                          className="h-48 object-contain rounded border"
                          style={{ borderColor: "#e8a96e" }}
                        />
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                      <p><span className="font-semibold">Modelo:</span> {detalle.modelo}</p>
                      <p><span className="font-semibold">Marca:</span> {detalle.marca}</p>
                      <p><span className="font-semibold">Condición:</span> {detalle.condicion}</p>
                      <p><span className="font-semibold">Año Fabricación:</span> {detalle.anio_fabricacion}</p>
                      <p><span className="font-semibold">Precio Estimado:</span> ${Number(detalle.precio_estimado).toLocaleString()}</p>
                      <p><span className="font-semibold">Estado:</span> {detalle.estado}</p>
                      <p><span className="font-semibold">Fecha Registro:</span> {detalle.fecha_registro}</p>
                      <p>
                        <span className="font-semibold">Vendedor:</span>{" "}
                        {detalle.vendedor
                          ? `${detalle.vendedor.nombre} ${detalle.vendedor.apellido}`
                          : "Sin vendedor"}
                      </p>
                    </div>

                    <div className="text-sm">
                      <p className="font-semibold mb-1">Descripción:</p>
                      <p className="text-gray-700">{detalle.descripcion}</p>
                    </div>

                    {detalle.categorias && detalle.categorias.length > 0 && (
                      <div className="text-sm">
                        <p className="font-semibold mb-1">Categorías:</p>
                        <div className="flex gap-2 flex-wrap">
                          {detalle.categorias.map((cat, i) => (
                            <span
                              key={i}
                              className="px-2 py-1 rounded-full text-xs font-medium"
                              style={{ backgroundColor: "#fdf3e7", border: "1px solid #e8a96e", color: "#845b34" }}
                            >
                              {cat.nombre}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {detalle.historial_subastas && detalle.historial_subastas.length > 0 && (
                      <div className="text-sm">
                        <p className="font-semibold mb-2">Historial de Subastas:</p>
                        <div className="space-y-2">
                          {detalle.historial_subastas.map((sub) => (
                            <div
                              key={sub.id_subasta}
                              className="px-3 py-2 rounded text-xs"
                              style={{ backgroundColor: "#fdf3e7", border: "1px solid #e8a96e" }}
                            >
                              <p><span className="font-semibold">Estado:</span> {sub.estado_subasta}</p>
                              <p><span className="font-semibold">Inicio:</span> {sub.fecha_inicio} — <span className="font-semibold">Fin:</span> {sub.fecha_fin}</p>
                              <p><span className="font-semibold">Precio inicial:</span> ${Number(sub.precio_inicial).toLocaleString()} | <span className="font-semibold">Pujas:</span> {sub.cantidad_pujas}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div
                className="flex justify-end px-6 py-4 rounded-b-lg"
                style={{ borderTop: "1px solid #e8a96e" }}
              >
                <button
                  onClick={() => setDetalle(null)}
                  className="px-4 py-2 rounded text-sm font-semibold"
                  style={{ backgroundColor: "#845b34", color: "#e8a96e" }}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── MODAL AGREGAR ── */}
        {modalAbierto && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            onClick={(e) => {
              if (e.target === e.currentTarget) cerrarModal();
            }}
          >
            <div
              className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              style={{ border: "2px solid #845b34" }}
            >
              <div
                className="flex items-center justify-between px-6 py-4 rounded-t-lg"
                style={{ backgroundColor: "#845b34" }}
              >
                <h2 className="text-xl font-bold font-[Georgia] text-[#e8a96e]">
                  Agregar Nuevo Objeto
                </h2>
                <button
                  onClick={cerrarModal}
                  className="text-[#e8a96e] hover:opacity-70 text-2xl font-bold leading-none"
                >
                  ×
                </button>
              </div>

              <div className="px-6 py-5 space-y-4 text-[#5b3717]">
                {/* Vendedor provisional */}
                <div className="text-sm" style={{ color: "#5b3717" }}>
                  <strong>Vendedor:</strong>{" "}
                  {vendedorProvisional
                    ? `${vendedorProvisional.nombre} ${vendedorProvisional.apellido}`
                    : "Cargando..."}
                </div>

                {/* Modelo */}
                <div>
                  <label className="block text-sm font-semibold mb-1">Modelo *</label>
                  <input
                    name="modelo"
                    value={form.modelo}
                    onChange={handleChange}
                    placeholder="Ej: Submariner 116610"
                    className="w-full border rounded px-3 py-2 text-sm focus:outline-none"
                    style={{ borderColor: errores.modelo ? "#dc2626" : "#845b34" }}
                  />
                  {errores.modelo && <p className="text-red-600 text-xs mt-1">{errores.modelo}</p>}
                </div>

                {/* Descripción */}
                <div>
                  <label className="block text-sm font-semibold mb-1">
                    Descripción * (mín. 20 caracteres)
                  </label>
                  <textarea
                    name="descripcion"
                    value={form.descripcion}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Descripción del objeto..."
                    className="w-full border rounded px-3 py-2 text-sm focus:outline-none resize-none"
                    style={{ borderColor: errores.descripcion ? "#dc2626" : "#845b34" }}
                  />
                  <p className="text-xs mt-1" style={{ color: form.descripcion.length < 20 ? "#845b34" : "#16a34a" }}>
                    {form.descripcion.length} / 20 caracteres mínimos
                  </p>
                  {errores.descripcion && <p className="text-red-600 text-xs">{errores.descripcion}</p>}
                </div>

                {/* Año y Precio */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1">Año de Fabricación *</label>
                    <input
                      type="number"
                      name="anio_fabricacion"
                      value={form.anio_fabricacion}
                      onChange={handleChange}
                      placeholder="Ej: 2018"
                      min="1800"
                      max={new Date().getFullYear()}
                      className="w-full border rounded px-3 py-2 text-sm focus:outline-none"
                      style={{ borderColor: errores.anio_fabricacion ? "#dc2626" : "#845b34" }}
                    />
                    {errores.anio_fabricacion && <p className="text-red-600 text-xs mt-1">{errores.anio_fabricacion}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Precio Estimado ($) *</label>
                    <input
                      type="number"
                      name="precio_estimado"
                      value={form.precio_estimado}
                      onChange={handleChange}
                      placeholder="Ej: 15000"
                      min="0"
                      step="0.01"
                      className="w-full border rounded px-3 py-2 text-sm focus:outline-none"
                      style={{ borderColor: errores.precio_estimado ? "#dc2626" : "#845b34" }}
                    />
                    {errores.precio_estimado && <p className="text-red-600 text-xs mt-1">{errores.precio_estimado}</p>}
                  </div>
                </div>

                {/* Marca y Condición */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1">Marca *</label>
                    <select
                      name="id_marca"
                      value={form.id_marca}
                      onChange={handleChange}
                      className="w-full border rounded px-3 py-2 text-sm focus:outline-none bg-white"
                      style={{ borderColor: errores.id_marca ? "#dc2626" : "#845b34" }}
                    >
                      <option value="">-- Seleccione --</option>
                      {marcas.map((m) => (
                        <option key={m.id_marca} value={m.id_marca}>{m.nombre}</option>
                      ))}
                    </select>
                    {errores.id_marca && <p className="text-red-600 text-xs mt-1">{errores.id_marca}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Condición *</label>
                    <select
                      name="id_condicion"
                      value={form.id_condicion}
                      onChange={handleChange}
                      className="w-full border rounded px-3 py-2 text-sm focus:outline-none bg-white"
                      style={{ borderColor: errores.id_condicion ? "#dc2626" : "#845b34" }}
                    >
                      <option value="">-- Seleccione --</option>
                      {condiciones.map((c) => (
                        <option key={c.id_condicion} value={c.id_condicion}>{c.nombre}</option>
                      ))}
                    </select>
                    {errores.id_condicion && <p className="text-red-600 text-xs mt-1">{errores.id_condicion}</p>}
                  </div>
                </div>

                {/* Imagen */}
                <div>
                  <label className="block text-sm font-semibold mb-1">Imagen *</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImagen}
                    className="w-full text-sm text-[#5b3717]"
                    style={{
                      border: errores.imagen ? "1px solid #dc2626" : "1px solid #845b34",
                      borderRadius: "4px",
                      padding: "6px",
                    }}
                  />
                  {imagen && (
                    <p className="text-xs mt-1 text-green-700">
                      Archivo seleccionado: {imagen.name}
                    </p>
                  )}
                  {errores.imagen && (
                    <p className="text-red-600 text-xs mt-1">{errores.imagen}</p>
                  )}
                </div>

                {/* Categorías */}
                {categorias.length > 0 && (
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Categorías * (máx. 2)
                      <span className="ml-2 font-normal text-xs" style={{ color: "#845b34" }}>
                        {categoriasSeleccionadas.length}/2 seleccionadas
                      </span>
                    </label>
                    <div className="space-y-1">
                      {categorias.map((cat) => (
                        <label
                          key={cat.id_categoria}
                          className="flex items-center gap-2 text-sm cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={categoriasSeleccionadas.includes(cat.id_categoria)}
                            onChange={() => toggleCategoria(cat.id_categoria)}
                            style={{ accentColor: "#845b34" }}
                          />
                          {cat.nombre}
                        </label>
                      ))}
                    </div>
                    {errores.categorias && (
                      <p className="text-red-600 text-xs mt-1">{errores.categorias}</p>
                    )}
                    <p className="text-xs mt-1" style={{ color: "#845b34" }}>
                      Si seleccionás una tercera, se reemplaza la primera automáticamente.
                    </p>
                  </div>
                )}
              </div>

              {/* Footer modal */}
              <div
                className="flex justify-end gap-3 px-6 py-4 rounded-b-lg"
                style={{ borderTop: "1px solid #e8a96e" }}
              >
                <button
                  onClick={cerrarModal}
                  className="px-4 py-2 rounded border text-sm font-semibold transition hover:opacity-70"
                  style={{ borderColor: "#845b34", color: "#845b34" }}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleGuardar}
                  disabled={guardando}
                  className="px-4 py-2 rounded text-sm font-semibold transition hover:opacity-90 disabled:opacity-50"
                  style={{ backgroundColor: "#845b34", color: "#e8a96e" }}
                >
                  {guardando ? "Guardando..." : "Guardar Objeto"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}