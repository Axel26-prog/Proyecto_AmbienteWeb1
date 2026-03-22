import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getRelojDetalle,
  actualizarReloj,
  getMarcas,
  getCondiciones,
  getCategorias,
} from "@/services/ObjetoServices";

export default function ObjetoEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [marcas, setMarcas] = useState([]);
  const [condiciones, setCondiciones] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriasSeleccionadas, setCategoriasSeleccionadas] = useState([]);
  const [imagen, setImagen] = useState(null);

  const [reloj, setReloj] = useState({
    modelo: "",
    descripcion: "",
    anio_fabricacion: "",
    precio_estimado: "",
    id_marca: "",
    id_condicion: "",
  });

  const [errores, setErrores] = useState({});
  const [toast, setToast] = useState(null); // { tipo: "exito" | "error", mensaje: string }
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    iniciar();
  }, []);

  // Cierra el toast automáticamente después de 3 segundos
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const iniciar = async () => {
    try {
      setLoading(true);
      const marcasData = await getMarcas();
      const condicionesData = await getCondiciones();
      const categoriasData = await getCategorias();
      const relojData = await getRelojDetalle(id);

      setMarcas(marcasData);
      setCondiciones(condicionesData);
      setCategorias(categoriasData);
      setReloj(relojData);
      setCategoriasSeleccionadas(relojData.categorias.map((c) => c.id_categoria));
    } catch (error) {
      console.error("Error cargando datos", error);
      setToast({ tipo: "error", mensaje: "No se pudo cargar la información del objeto." });
    } finally {
      setLoading(false);
    }
  };

  const toggleCategoria = (idCat) => {
    if (categoriasSeleccionadas.includes(idCat)) {
      setCategoriasSeleccionadas(categoriasSeleccionadas.filter((c) => c !== idCat));
    } else {
      if (categoriasSeleccionadas.length >= 2) {
        setCategoriasSeleccionadas([...categoriasSeleccionadas.slice(1), idCat]);
      } else {
        setCategoriasSeleccionadas([...categoriasSeleccionadas, idCat]);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReloj({ ...reloj, [name]: value });
    // Limpiar error del campo al editar
    if (errores[name]) {
      setErrores({ ...errores, [name]: "" });
    }
  };

  const handleImagen = (e) => {
    setImagen(e.target.files[0]);
  };

  const validar = () => {
    const nuevosErrores = {};

    if (!reloj.modelo || reloj.modelo.trim() === "") {
      nuevosErrores.modelo = "El modelo es obligatorio.";
    }

    if (!reloj.descripcion || reloj.descripcion.trim().length < 20) {
      nuevosErrores.descripcion = "La descripción debe tener mínimo 20 caracteres.";
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const guardar = async (e) => {
    e.preventDefault();

    if (!validar()) return;

    try {
      const formData = new FormData();
      formData.append("id_reloj", id);
      formData.append("modelo", reloj.modelo);
      formData.append("descripcion", reloj.descripcion);
      formData.append("anio_fabricacion", reloj.anio_fabricacion);
      formData.append("precio_estimado", reloj.precio_estimado);
      formData.append("id_marca", reloj.id_marca);
      formData.append("id_condicion", reloj.id_condicion);
      formData.append("categorias", JSON.stringify(categoriasSeleccionadas));
      if (imagen) formData.append("imagen", imagen);

      await actualizarReloj(formData);

      setToast({ tipo: "exito", mensaje: "Objeto actualizado correctamente." });
      setTimeout(() => navigate("/objetos-admin"), 1800);
    } catch (error) {
      console.error("Error actualizando", error);
      setToast({ tipo: "error", mensaje: "Ocurrió un error al guardar los cambios." });
    }
  };

  return (
    <div className="p-6 font-[Montserrat] text-gray-900 bg-gray-100 min-h-screen flex flex-col items-center">

      {/* Toast de notificación */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3 rounded-lg shadow-lg text-white text-sm transition-all duration-300 ${
            toast.tipo === "exito" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          <span>{toast.tipo === "exito" ? "✓" : "✕"}</span>
          <span>{toast.mensaje}</span>
          <button
            onClick={() => setToast(null)}
            className="ml-2 text-white/70 hover:text-white font-bold"
          >
            ×
          </button>
        </div>
      )}

      <h1 className="text-2xl mb-6 font-bold text-[#845b34] w-full max-w-xl">
        Editar Objeto Subastable
      </h1>

      {loading && <p className="text-gray-500 italic">Cargando información...</p>}

      {!loading && (
        <form
          onSubmit={guardar}
          className="bg-white shadow-lg rounded-lg border border-[#845b34] p-6 w-full max-w-xl"
          noValidate
        >
          {/* Modelo */}
          <div className="mb-4">
            <label className="block mb-1 text-[#845b34] font-semibold">
              Modelo
            </label>
            <input
              type="text"
              name="modelo"
              value={reloj.modelo || ""}
              onChange={handleChange}
              className={`w-full border p-2 rounded bg-white text-gray-900 ${
                errores.modelo ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errores.modelo && (
              <p className="mt-1 text-sm text-red-600">{errores.modelo}</p>
            )}
          </div>

          {/* Descripción */}
          <div className="mb-4">
            <label className="block mb-1 text-[#845b34] font-semibold">
              Descripción
            </label>
            <textarea
              name="descripcion"
              value={reloj.descripcion || ""}
              onChange={handleChange}
              className={`w-full border p-2 rounded bg-white text-gray-900 ${
                errores.descripcion ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errores.descripcion && (
              <p className="mt-1 text-sm text-red-600">{errores.descripcion}</p>
            )}
            <p className="text-xs text-gray-400 mt-1">
              {(reloj.descripcion || "").length} / 20 caracteres mínimos
            </p>
          </div>

          {/* Año */}
          <div className="mb-4">
            <label className="block mb-1 text-[#845b34] font-semibold">
              Año Fabricación
            </label>
            <input
              type="number"
              name="anio_fabricacion"
              value={reloj.anio_fabricacion || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded bg-white text-gray-900"
            />
          </div>

          {/* Precio */}
          <div className="mb-4">
            <label className="block mb-1 text-[#845b34] font-semibold">
              Precio Estimado
            </label>
            <input
              type="number"
              name="precio_estimado"
              value={reloj.precio_estimado || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded bg-white text-gray-900"
            />
          </div>

          {/* Marca */}
          <div className="mb-4">
            <label className="block mb-1 text-[#845b34] font-semibold">
              Marca
            </label>
            <select
              name="id_marca"
              value={reloj.id_marca || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded bg-white text-gray-900"
            >
              <option value="">Seleccione marca</option>
              {marcas.map((m) => (
                <option key={m.id_marca} value={m.id_marca}>
                  {m.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Condición */}
          <div className="mb-4">
            <label className="block mb-1 text-[#845b34] font-semibold">
              Condición
            </label>
            <select
              name="id_condicion"
              value={reloj.id_condicion || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded bg-white text-gray-900"
            >
              <option value="">Seleccione condición</option>
              {condiciones.map((c) => (
                <option key={c.id_condicion} value={c.id_condicion}>
                  {c.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Imagen */}
          <div className="mb-4">
            <label className="block mb-1 text-[#845b34] font-semibold">
              Imagen
            </label>
            <input
              type="file"
              onChange={handleImagen}
              className="text-gray-900"
            />
          </div>

          {/* Categorías */}
          <div className="mb-4">
            <label className="block mb-2 text-[#845b34] font-semibold">
              Categorías (máx 2)
            </label>
            {categorias.map((cat) => (
              <label
                key={cat.id_categoria}
                className="flex items-center gap-2 text-gray-900"
              >
                <input
                  type="checkbox"
                  checked={categoriasSeleccionadas.includes(cat.id_categoria)}
                  onChange={() => toggleCategoria(cat.id_categoria)}
                />
                {cat.nombre}
              </label>
            ))}
          </div>

          {/* Botones */}
          <div className="flex gap-3 mt-4">
            <button
              type="submit"
              className="px-4 py-2 rounded bg-[#845b34] text-white hover:bg-[#6e4a27] transition-colors"
            >
              Guardar Cambios
            </button>
            <button
              type="button"
              onClick={() => navigate("/objetos-admin")}
              className="px-4 py-2 rounded border border-[#845b34] text-[#845b34] hover:bg-[#845b34]/10 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}
    </div>
  );
}