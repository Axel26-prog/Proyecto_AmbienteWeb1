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

  const toggleCategoria = (id) => {
  if (categoriasSeleccionadas.includes(id)) {
    setCategoriasSeleccionadas(
      categoriasSeleccionadas.filter((c) => c !== id)
    );
  } else {

    
    if (categoriasSeleccionadas.length >= 2) {
      const nuevas = [...categoriasSeleccionadas.slice(1), id];
      setCategoriasSeleccionadas(nuevas);
    } else {
      setCategoriasSeleccionadas([...categoriasSeleccionadas, id]);
    }

  }
};

  const [reloj, setReloj] = useState({
    modelo: "",
    descripcion: "",
    anio_fabricacion: "",
    precio_estimado: "",
    id_marca: "",
    id_condicion: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
  iniciar();
}, []);

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

    setReloj({
      ...relojData,
    });

    const marcaEncontrada = marcasData.find(
      (m) => m.nombre === relojData.marca
    );

    if (marcaEncontrada) {
      setReloj((prev) => ({
        ...prev,
        id_marca: marcaEncontrada.id_marca,
      }));
    }

    const condicionEncontrada = condicionesData.find(
      (c) => c.nombre === relojData.condicion
    );

    if (condicionEncontrada) {
      setReloj((prev) => ({
        ...prev,
        id_condicion: condicionEncontrada.id_condicion,
      }));
    }

    const idsCategorias = relojData.categorias.map((id) => String(id));
    setCategoriasSeleccionadas(idsCategorias);

  } catch (error) {
    console.error("Error cargando datos", error);
  } finally {
    setLoading(false);
  }
};


  const handleChange = (e) => {
    setReloj({
      ...reloj,
      [e.target.name]: e.target.value,
    });
  };

  const guardar = async (e) => {
    e.preventDefault();

    if (!reloj.modelo) {
      alert("El nombre es obligatorio");
      return;
    }

    if (!reloj.descripcion || reloj.descripcion.length < 20) {
      alert("La descripción debe tener mínimo 20 caracteres");
      return;
    }

    try {
      const datos = {
        ...reloj,
        categorias: categoriasSeleccionadas,
      };

      await actualizarReloj(datos);

      alert("Objeto actualizado correctamente");

      navigate("/objetos-admin");
    } catch (error) {
      console.error("Error actualizando", error);
      alert("Error al actualizar");
    }
  };

  return (
    <div className="p-6 font-[Montserrat]">
      {/* Titulo */}
      <h1 className="text-2xl mb-6 font-bold font-[Georgia] text-[#845b34]">
        Editar Objeto Subastable
      </h1>

      {loading && <p className="text-[#845b34]">Cargando información...</p>}

      {!loading && (
        <form
          onSubmit={guardar}
          className="bg-white shadow rounded-lg border border-[#845b34] p-6 max-w-xl"
        >
          {/* Modelo */}
          <div className="mb-4">
            <label className="block mb-1 font-[Georgia] text-[#845b34]">
              Modelo
            </label>
            <input
              type="text"
              name="modelo"
              value={reloj.modelo || ""}
              onChange={handleChange}
              className="w-full border p-2 rounded bg-white text-gray-900"
            />
          </div>

          {/* Descripción */}
          <div className="mb-4">
            <label className="block mb-1 font-[Georgia] text-[#845b34]">
              Descripción
            </label>
            <textarea
              name="descripcion"
              value={reloj.descripcion || ""}
              onChange={handleChange}
              className="w-full border p-2 rounded bg-white text-gray-900"
            />
          </div>

          {/* Año */}
          <div className="mb-4">
            <label className="block mb-1 font-[Georgia] text-[#845b34]">
              Año Fabricación
            </label>
            <input
              type="number"
              name="anio_fabricacion"
              value={reloj.anio_fabricacion || ""}
              onChange={handleChange}
              className="w-full border p-2 rounded bg-white text-gray-900"
            />
          </div>

          {/* Precio */}
          <div className="mb-4">
            <label className="block mb-1 font-[Georgia] text-[#845b34]">
              Precio Estimado
            </label>
            <input
              type="number"
              name="precio_estimado"
              value={reloj.precio_estimado || ""}
              onChange={handleChange}
              className="w-full border p-2 rounded bg-white text-gray-900"
            />
          </div>

          {/* Marca */}
          <div className="mb-4">
            <label className="block mb-1 font-[Georgia] text-[#845b34]">
              Marca
            </label>
            <select
              name="id_marca"
              value={reloj.id_marca || ""}
              onChange={handleChange}
              className="w-full border p-2 rounded bg-white text-gray-900"
            >
              <option value="">Seleccione marca</option>

              {marcas.map((marca) => (
                <option key={marca.id_marca} value={marca.id_marca}>
                  {marca.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Condición */}
          <div className="mb-4">
            <label className="block mb-1 font-[Georgia] text-[#845b34]">
              Condición
            </label>
            <select
              name="id_condicion"
              value={reloj.id_condicion || ""}
              onChange={handleChange}
              className="w-full border p-2 rounded bg-white text-gray-900"
            >
              <option value="">Seleccione condición</option>

              {condiciones.map((cond) => (
                <option key={cond.id_condicion} value={cond.id_condicion}>
                  {cond.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block mb-1 font-[Georgia] text-[#845b34]">
              Categorías
            </label>

            <div className="flex flex-wrap gap-3">
              {categorias.map((cat) => (
                <label
                  key={cat.id_categoria}
                  className="flex items-center gap-1 text-[#845b34] font-[Georgia]"
                >
                  <input
                    type="checkbox"
                    checked={categoriasSeleccionadas.includes(String(cat.id_categoria))}
                    onChange={() => toggleCategoria(cat.id_categoria)}
                  />

                  {cat.nombre}
                </label>
              ))}
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-3 mt-4">
            <button
              type="submit"
              className="px-4 py-2 rounded font-[Montserrat]"
              style={{
                backgroundColor: "#845b34",
                color: "#e8a96e",
              }}
            >
              Guardar Cambios
            </button>

            <button
              type="button"
              className="px-4 py-2 rounded border"
              style={{
                borderColor: "#845b34",
                color: "#845b34",
              }}
              onClick={() => navigate("/objetos-admin")}
            >
              Cancelar
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
