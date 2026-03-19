import { useEffect, useState } from "react";
import { getUsuarios, getUsuarioDetalle, deleteUsuario } from "@/services/UsuarioServices";
import UsuarioModal from "@/components/UsuariosModal";

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [detalle, setDetalle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const [modoModal, setModoModal] = useState("crear");
  const [usuarioEditar, setUsuarioEditar] = useState(null);

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

  const verDetalle = async (id) => {
    if (!id) return;

    try {
      setLoading(true);
      const data = await getUsuarioDetalle(id);
      setDetalle(data);
    } catch (error) {
      console.error("Error cargando detalle", error);
    } finally {
      setLoading(false);
    }
  };

  const abrirEditar = () => {
    if (!detalle) return;

    setModoModal("editar");
    setUsuarioEditar(detalle);
    setOpenModal(true);
  };

  const eliminarUsuario = async (id, estado) => {
    if (!id) return;

    const mensaje =
      estado === "Activo"
        ? "¿Desea eliminar (desactivar) este usuario?"
        : "¿Desea reactivar este usuario?";

    const confirmado = window.confirm(mensaje);
    if (!confirmado) return;

    try {
      await deleteUsuario(id);
      await cargarUsuarios();

      if (detalle && detalle.id_usuario === id) {
        await verDetalle(id);
      }
    } catch (error) {
      console.error("Error cambiando estado del usuario", error);
      alert("No se pudo cambiar el estado del usuario");
    }
  };

  return (
    <div className="p-6 font-[Montserrat]">
      <UsuarioModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        modo={modoModal}
        usuario={usuarioEditar}
        onGuardar={async () => {
          await cargarUsuarios();

          if (detalle?.id_usuario) {
            await verDetalle(detalle.id_usuario);
          }
        }}
      />

      <div className="mb-4 flex items-center justify-between">
        <h1 className="font-[Georgia] text-2xl font-bold text-[#845b34]">
          Usuarios y Perfiles
        </h1>

        <button
          onClick={() => {
            setModoModal("crear");
            setUsuarioEditar(null);
            setOpenModal(true);
          }}
          className="rounded bg-[#845b34] px-4 py-2 font-[Montserrat] font-semibold text-[#e8a96e] transition-all duration-300 hover:scale-105 hover:bg-[#5b3717]"
        >
          + Agregar
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-[#845b34] bg-white shadow">
        <table className="w-full">
          <thead className="bg-[#845b34] font-[Georgia] font-bold text-[#e8a96e]">
            <tr>
              <th className="p-3 text-left">Nombre Completo</th>
              <th className="p-3 text-left">Rol</th>
              <th className="p-3 text-left">Estado</th>
              <th className="p-3 text-left">Acciones</th>
            </tr>
          </thead>

          <tbody className="text-[#5b3717]">
            {usuarios.map((usuario) => (
              <tr
                key={usuario.id_usuario}
                className={`border-t border-[#845b34]/20 ${usuario.estado === "Inactivo"
                    ? "bg-gray-100"   
                    : "bg-white"
                  }`}
              >
                <td
                  className={`p-3 ${usuario.estado === "Inactivo" ? "text-gray-500" : ""
                    }`}
                >
                  {usuario.nombre} {usuario.apellido}
                </td>

                <td
                  className={`p-3 ${usuario.estado === "Inactivo" ? "text-gray-500" : ""
                    }`}
                >
                  {usuario.rol}
                </td>

                <td
                  className={`p-3 ${usuario.estado === "Inactivo" ? "font-semibold text-gray-500" : ""
                    }`}
                >
                  {usuario.estado}
                </td>

                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <button
                      className={`rounded px-3 py-1 font-[Montserrat] transition-all duration-300 ${usuario.estado === "Inactivo"
                          ? "cursor-not-allowed bg-[#cbb9a6] text-white"
                          : "bg-[#845b34] text-[#e8a96e] hover:scale-105 hover:bg-[#5b3717]"
                        }`}
                      onClick={() =>
                        usuario.estado !== "Inactivo" && verDetalle(usuario.id_usuario)
                      }
                    >
                      Detalle
                    </button>

                    <button
                      className={`rounded px-3 py-1 font-[Montserrat] text-white transition-all duration-300 hover:scale-105 ${usuario.estado === "Activo"
                          ? "bg-red-600 hover:bg-red-700"
                          : "bg-green-600 hover:bg-green-700"
                        }`}
                      onClick={() => eliminarUsuario(usuario.id_usuario, usuario.estado)}
                    >
                      {usuario.estado === "Activo" ? "Eliminar" : "Reactivar"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {detalle && (
        <div className="mt-6 rounded bg-gray-50 p-4 font-[Montserrat] text-gray-900 shadow">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="font-[Georgia] text-xl font-bold text-[#845b34]">
              Detalle de Usuario
            </h2>

            <button
              onClick={abrirEditar}
              className="rounded bg-[#845b34] px-3 py-1 font-[Montserrat] font-semibold text-[#e8a96e] transition-all duration-300 hover:scale-105 hover:bg-[#5b3717]"
            >
              Editar
            </button>
          </div>

          <p>
            <strong>Nombre:</strong> {detalle.nombre} {detalle.apellido}
          </p>
          <p>
            <strong>Correo:</strong> {detalle.correo}
          </p>
          <p>
            <strong>Teléfono:</strong> {detalle.telefono}
          </p>
          <p>
            <strong>Rol:</strong> {detalle.rol}
          </p>
          <p>
            <strong>Estado:</strong> {detalle.estado}
          </p>
          <p>
            <strong>Fecha Registro:</strong>{" "}
            {new Date(detalle.fecha_registro).toLocaleString()}
          </p>

          {detalle.rol === "Vendedor" && (
            <p>
              <strong>Cantidad de Subastas:</strong> {detalle.cantidad_subastas}
            </p>
          )}

          {detalle.rol === "Cliente" && (
            <p>
              <strong>Cantidad de Pujas:</strong> {detalle.cantidad_pujas}
            </p>
          )}
        </div>
      )}

      {loading && <p className="mt-2 text-[#845b34]">Cargando detalle...</p>}
    </div>
  );
}