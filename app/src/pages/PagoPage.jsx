import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BrandMenuBar from "../components/Layout/BrandMenuBar";
import { getUsuarioActualId, armarRutaConUsuario } from "../utils/usuarioActual";
import { getPagosByUsuario, confirmarPago } from "../services/PagoService";
import { getUsuarioDetalle } from "../services/UsuarioServices";

const API_URL = import.meta.env.VITE_API_URL;

export default function PagoPage() {
    const navigate = useNavigate();
    const usuarioActualId = getUsuarioActualId();//obtiene el usuario actual desde la lógica

    const [nombreUsuarioActual, setNombreUsuarioActual] = useState("");
    const [pagos, setPagos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [confirmandoId, setConfirmandoId] = useState(null);

    useEffect(() => {
        let alive = true;
        //carga el nombre del usuario actual para mostrarlo en la interfaz
        const cargarUsuarioActual = async () => {
            try {
                if (!usuarioActualId) {
                    setNombreUsuarioActual("");
                    return;
                }

                const data = await getUsuarioDetalle(usuarioActualId);
                const usuario = data?.data || data;

                if (!alive) return;

                if (usuario?.nombre) {
                    setNombreUsuarioActual(
                        `${usuario.nombre} ${usuario.apellido || ""}`.trim()
                    );
                } else {
                    setNombreUsuarioActual("");
                }
            } catch (e) {
                if (alive) setNombreUsuarioActual("");
            }
        };

        cargarUsuarioActual();

        return () => {
            alive = false;
        };
    }, [usuarioActualId]);

    useEffect(() => {
        let alive = true;
        //carga todos los pagos asociados al usuario actual
        const cargarPagos = async () => {
            try {
                setLoading(true);
                setError("");
                //si no hay usuario actual, no se puede consultar pagos
                if (!usuarioActualId) {
                    setError("No se encontró el usuario actual.");
                    return;
                }
                //consulta pagos del usuario ganador
                const data = await getPagosByUsuario(usuarioActualId);

                if (!alive) return;
                setPagos(Array.isArray(data) ? data : []);
            } catch (e) {
                if (!alive) return;
                setError(e.message || "Error al cargar pagos");
            } finally {
                if (alive) setLoading(false);
            }
        };

        cargarPagos();

        return () => {
            alive = false;
        };
    }, [usuarioActualId]);

    //confirma un pago específico
    const handleConfirmarPago = async (pago) => {
        try {
            setConfirmandoId(pago.id_pago);

            await confirmarPago(pago);//envía la confirmación al backend

            //actualiza la UI localmente para reflejar el cambio
            setPagos((prev) =>
                prev.map((p) =>
                    Number(p.id_pago) === Number(pago.id_pago)
                        ? {
                            ...p,
                            id_estado_pago: 2,
                            estado_pago: "confirmado",
                            fecha_pago: new Date().toISOString(),
                        }
                        : p
                )
            );
        } catch (e) {
            alert(e.message || "Error al confirmar el pago");
        } finally {
            setConfirmandoId(null);
        }
    };
//separa pagos pendientes de pagos confirmados
    const pagosPendientes = pagos.filter((p) => Number(p.id_estado_pago) !== 2);
    const pagosConfirmados = pagos.filter((p) => Number(p.id_estado_pago) === 2);

    return (
        <div className="bg-gray-100 min-h-screen font-[Montserrat]">
            <BrandMenuBar />

            <div className="max-w-6xl mx-auto p-6">
                <div className="flex items-center justify-between mb-6">
                    <h1
                        className="text-3xl font-bold text-[#845b34]"
                        style={{ fontFamily: "Georgia" }}
                    >
                        Mis Pagos
                    </h1>

                    <button
                        onClick={() => navigate(armarRutaConUsuario("/subastas"))}
                        className="px-4 py-2 rounded text-sm font-semibold"
                        style={{ backgroundColor: "#845b34", color: "#e8a96e" }}
                    >
                        Ver Subastas Activas
                    </button>
                </div>

                <div
                    className="mb-6 px-4 py-3 rounded text-sm"
                    style={{
                        backgroundColor: "#fdf3e7",
                        border: "1px solid #e8a96e",
                        color: "#845b34",
                    }}
                >
                    Usuario actual:{" "}
                    <strong>{nombreUsuarioActual || "Sin usuario seleccionado"}</strong>
                </div>

                {loading && <p className="text-[#845b34]">Cargando pagos...</p>}

                {!loading && error && (
                    <div className="bg-white border border-red-200 rounded p-4 text-red-600">
                        {error}
                    </div>
                )}

                {!loading && !error && pagos.length === 0 && (
                    <div className="bg-white rounded-lg shadow p-6 text-[#845b34]">
                        No tienes pagos registrados.
                    </div>
                )}

                {!loading && !error && pagos.length > 0 && (
                    <>
                        <section className="mb-8">
                            <h2
                                className="text-2xl font-bold mb-4 text-[#845b34]"
                                style={{ fontFamily: "Georgia" }}
                            >
                                Pagos Pendientes
                            </h2>

                            {pagosPendientes.length === 0 ? (
                                <div className="bg-white rounded-lg shadow p-4 text-green-700 font-semibold">
                                    No tienes pagos pendientes.
                                </div>
                            ) : (
                                <div className="grid gap-6 md:grid-cols-2">
                                    {pagosPendientes.map((pago) => {
                                        const imgUrl = pago.imagen
                                            ? `${API_URL}/uploads/${pago.imagen}`
                                            : null;

                                        return (
                                            <div
                                                key={pago.id_pago}
                                                className="bg-white rounded-lg shadow p-5"
                                            >
                                                {imgUrl && (
                                                    <div className="h-52 bg-white flex items-center justify-center overflow-hidden mb-4 rounded border border-[#e8a96e]">
                                                        <img
                                                            src={imgUrl}
                                                            alt={pago.modelo}
                                                            className="max-h-full max-w-full object-contain"
                                                        />
                                                    </div>
                                                )}

                                                <h3
                                                    className="text-xl font-bold mb-2 text-[#845b34]"
                                                    style={{ fontFamily: "Georgia" }}
                                                >
                                                    {pago.modelo}
                                                </h3>

                                                <div className="space-y-2 text-sm text-[#5b3717] mb-4">
                                                    <p><strong>Marca:</strong> {pago.marca}</p>
                                                    <p><strong>Subasta:</strong> #{pago.id_subasta}</p>
                                                    <p><strong>Monto:</strong> ${Number(pago.monto).toLocaleString()}</p>
                                                    <p><strong>Método:</strong> {pago.metodo_pago}</p>
                                                    <p>
                                                        <strong>Estado:</strong>{" "}
                                                        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-600">
                                                            Pendiente de pago
                                                        </span>
                                                    </p>
                                                    <p><strong>Fecha asignación:</strong> {pago.fecha_asignacion}</p>
                                                </div>

                                                <div className="flex gap-3">
                                                    <button
                                                        onClick={() =>
                                                            navigate(armarRutaConUsuario(`/subasta/${pago.id_subasta}`))
                                                        }
                                                        className="flex-1 px-4 py-2 rounded font-semibold border"
                                                        style={{ borderColor: "#845b34", color: "#845b34" }}
                                                    >
                                                        Ver Subasta
                                                    </button>

                                                    <button
                                                        onClick={() => handleConfirmarPago(pago)}
                                                        disabled={confirmandoId === pago.id_pago}
                                                        className="flex-1 px-4 py-2 rounded font-semibold disabled:opacity-50"
                                                        style={{ backgroundColor: "#845b34", color: "#e8a96e" }}
                                                    >
                                                        {confirmandoId === pago.id_pago
                                                            ? "Confirmando..."
                                                            : "Confirmar Pago"}
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </section>

                        <section>
                            <h2
                                className="text-2xl font-bold mb-4 text-[#845b34]"
                                style={{ fontFamily: "Georgia" }}
                            >
                                Pagos Confirmados
                            </h2>

                            {pagosConfirmados.length === 0 ? (
                                <div className="bg-white rounded-lg shadow p-4 text-[#845b34]">
                                    Aún no tienes pagos confirmados.
                                </div>
                            ) : (
                                <div className="grid gap-6 md:grid-cols-2">
                                    {pagosConfirmados.map((pago) => (
                                        <div
                                            key={pago.id_pago}
                                            className="bg-white rounded-lg shadow p-5"
                                        >
                                            <h3
                                                className="text-xl font-bold mb-2 text-[#845b34]"
                                                style={{ fontFamily: "Georgia" }}
                                            >
                                                {pago.modelo}
                                            </h3>

                                            <div className="space-y-2 text-sm text-[#5b3717]">
                                                <p><strong>Subasta:</strong> #{pago.id_subasta}</p>
                                                <p><strong>Monto:</strong> ${Number(pago.monto).toLocaleString()}</p>
                                                <p><strong>Método:</strong> {pago.metodo_pago}</p>
                                                <p>
                                                    <strong>Estado:</strong>{" "}
                                                    <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-600">
                                                        Confirmado
                                                    </span>
                                                </p>
                                                <p><strong>Fecha pago:</strong> {pago.fecha_pago}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>
                    </>
                )}
            </div>
        </div>
    );
}