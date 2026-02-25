import { useEffect, useState } from "react";
import { getUsuarios } from "@/services/UsuarioServices";

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [mostrarUsuarios, setMostrarUsuarios] = useState(false);

  useEffect(() => {
    if (mostrarUsuarios) {
      cargarUsuarios();
    }
  }, [mostrarUsuarios]);

  const cargarUsuarios = async () => {
    try {
      const data = await getUsuarios();
      setUsuarios(data);
    } catch (error) {
      console.error("Error cargando usuarios", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Visualización de Usuarios y Perfiles
      </h1>

      <button
        onClick={() => setMostrarUsuarios(true)}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Mostrar Usuarios
      </button>

      {mostrarUsuarios && (
  <div className="bg-white text-gray-900 shadow rounded-lg">
    <table className="w-full">
      <thead className="bg-gray-100 text-gray-800">
        <tr>
          <th className="p-3 text-left">Nombre Completo</th>
          <th className="p-3 text-left">Rol</th>
          <th className="p-3 text-left">Estado</th>
        </tr>
      </thead>
      <tbody>
        {usuarios.map((usuario) => (
          <tr key={usuario.id} className="border-t text-gray-700">
            <td className="p-3">{usuario.nombre}</td>
            <td className="p-3">{usuario.rol}</td>
            <td className="p-3">
              {usuario.estado === 1 ? "Bloqueado" : "Activo"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}
    </div>
  );
}