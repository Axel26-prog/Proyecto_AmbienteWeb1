import { useEffect, useState } from "react";
import { getUsuarios, getUsuarioDetalle } from "@/services/UsuarioServices";

//se importan los hooks useEffect y useState para el manejo del estado de la pagina
export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [detalle, setDetalle] = useState(null);
  const [loading, setLoading] = useState(false); //indica si está cargando la informacion


  useEffect(() => {
    cargarUsuarios();
  }, []);

  //llama al servicio getUsuarios
  const cargarUsuarios = async () => {
    try {
      const data = await getUsuarios();
      setUsuarios(data); //guarda la lista usuarios 
    } catch (error) {
      console.error("Error cargando usuarios", error);
    }
  };

  //llama al servicio getUsuarioDetalle
  const verDetalle = async (id) => {
    if (!id) return;
    try {
      setLoading(true);
      const data = await getUsuarioDetalle(id);
      setDetalle(data); //guarda los detalles del usuario seleccionada, incluyendo la cantidad de pujas y subastas
    } catch (error) {
      console.error("Error cargando detalle", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 font-[Montserrat]">
      
      {/* Título */}
      <h1 className="text-2xl mb-4 font-bold font-[Georgia] text-[#845b34]">
        Usuarios y Perfiles
      </h1>

      {/* Tabla */}
      <div className="bg-white shadow rounded-lg overflow-x-auto border border-[#845b34]">
        <table className="w-full">
          
          {/* Encabezado */}
          <thead className="bg-[#845b34] text-[#e8a96e] font-[Georgia] font-bold">
            <tr>
              <th className="p-3 text-left">Nombre Completo</th>
              <th className="p-3 text-left">Rol</th>
              <th className="p-3 text-left">Estado</th>
              <th className="p-3 text-left">Acciones</th>
            </tr>
          </thead>

          {/* Contenido */}
          <tbody className="text-[#5b3717]">
            {usuarios.map((usuario) => (
              <tr key={usuario.id_usuario} className="border-t border-[#845b34]/20">
                <td className="p-3">{usuario.nombre} {usuario.apellido}</td>
                <td className="p-3">{usuario.rol}</td>  {/* Inner Join para traer el nombre del rol */}
                <td className="p-3">{usuario.estado}</td> {/* Inner Join para traer el nombre del estado */}

                <td className="p-3">
                  <button
                    className="px-3 py-1 rounded font-[Montserrat]"
                    style={{
                      backgroundColor: "#845b34",
                      color: "#e8a96e"
                    }}
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

      {/* Detalle */}
      {detalle && (
        <div className="mt-6 p-4 bg-gray-50 shadow rounded text-gray-900 font-[Montserrat]">
          <h2 className="text-xl font-bold mb-2 font-[Georgia] text-[#845b34]">
            Detalle de Usuario
          </h2>
          <p><strong>Nombre:</strong> {detalle.nombre} {detalle.apellido}</p>
          <p><strong>Correo:</strong> {detalle.correo}</p>
          <p><strong>Teléfono:</strong> {detalle.telefono}</p>
          <p><strong>Rol:</strong> {detalle.rol}</p>
          <p><strong>Estado:</strong> {detalle.estado}</p>
          <p><strong>Fecha Registro:</strong> {new Date(detalle.fecha_registro).toLocaleString()}</p>

          {detalle.rol === "Vendedor" && (
            //se calcula los datos en el UsuarioModel
            <p><strong>Cantidad de Subastas:</strong> {detalle.cantidad_subastas}</p>
          )}

          {detalle.rol === "Cliente" && (
            //se calcula los datos en el UsuarioModel
            <p><strong>Cantidad de Pujas:</strong> {detalle.cantidad_pujas}</p>
          )}
        </div>
      )}

      {loading && <p className="mt-2 text-[#845b34]">Cargando detalle...</p>}
    </div>
  );
}