import { useEffect, useState } from "react";
import { getUsuarios, getUsuarioDetalle } from "@/services/UsuarioServices";

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [detalle, setDetalle] = useState(null);
  const [loading, setLoading] = useState(false);

  // Cargar usuarios al inicio
  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    try {
      const data = await getUsuarios();
      setUsuarios(data);
    } catch (error) {
      console.error("Error cargando usuarios", error);
    }
  };

  // Función para ver detalle de un usuario
  const verDetalle = async (id) => {
    if (!id) return; // evita undefined
    try {
      setLoading(true);
      const data = await getUsuarioDetalle(id);
      setDetalle(data); // ya devuelve json.data
    } catch (error) {
      console.error("Error cargando detalle", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Usuarios y Perfiles</h1>

      <div className="bg-white text-gray-900 shadow rounded-lg overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100 text-gray-800">
            <tr>
              <th className="p-3 text-left">Nombre Completo</th>
              <th className="p-3 text-left">Rol</th>
              <th className="p-3 text-left">Estado</th>
              <th className="p-3 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((usuario) => (
              <tr key={usuario.id_usuario} className="border-t text-gray-700">
                <td className="p-3">{usuario.nombre} {usuario.apellido}</td>
                <td className="p-3">{usuario.rol}</td>
                <td className="p-3">{usuario.estado}</td>
                <td className="p-3">
                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    onClick={() => verDetalle(usuario.id_usuario)}
                  >
                    Detalle
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {detalle && (
  <div className="mt-6 p-4 bg-gray-50 shadow rounded text-gray-900">
    <h2 className="text-xl font-bold mb-2">Detalle de Usuario</h2>
    <p><strong>Nombre:</strong> {detalle.nombre} {detalle.apellido}</p>
    <p><strong>Correo:</strong> {detalle.correo}</p>
    <p><strong>Teléfono:</strong> {detalle.telefono}</p>
    <p><strong>Rol:</strong> {detalle.rol}</p>
    <p><strong>Estado:</strong> {detalle.estado}</p>
    <p><strong>Fecha Registro:</strong> {new Date(detalle.fecha_registro).toLocaleString()}</p>
    {detalle.rol === "Vendedor" && (
      <p><strong>Cantidad de Subastas:</strong> {detalle.cantidad_subastas}</p>
    )}
    {detalle.rol === "Cliente" && (
      <p><strong>Cantidad de Pujas:</strong> {detalle.cantidad_pujas}</p>
    )}
  </div>
)}

      {loading && <p className="mt-2 text-gray-500">Cargando detalle...</p>}
    </div>
  );
}