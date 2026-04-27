import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPagosAdmin } from "../services/PagoService";

const API_URL = import.meta.env.VITE_API_URL;

export default function AdminVerPagos() {
    const navigate = useNavigate();

    const [pagos, setPagos] = useState([]);
    const [estadoFiltro, setEstadoFiltro] = useState("todos");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const cargarPagos = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await getPagosAdmin();
                setPagos(Array.isArray(data) ? data : []);
            } catch (e) {
                setError(e.message || "Error al cargar los pagos");
            } finally {
                setLoading(false);
            }
        };

        cargarPagos();
    }, []);

    const pagosFiltrados = pagos.filter((pago) => {
        if (estadoFiltro === "todos") return true;

        return Number(pago.id_estado_pago) === Number(estadoFiltro);
    });

    const totalPendientes = pagos.filter(
        (p) => Number(p.id_estado_pago) !== 2
    ).length;

    const totalConfirmados = pagos.filter(
        (p) => Number(p.id_estado_pago) === 2
    ).length;

    const montoTotal = pagos.reduce(
        (total, p) => total + Number(p.monto || 0),
        0
    );

    const montoPendiente = pagos
        .filter((p) => Number(p.id_estado_pago) !== 2)
        .reduce((total, p) => total + Number(p.monto || 0), 0);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 p-6 font-[Montserrat] text-[#845b34]">
                Cargando pagos...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 font-[Montserrat]">
            <div className="mx-auto max-w-7xl p-6">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1
                            className="text-4xl font-bold text-[#845b34]"
                            style={{ fontFamily: "Georgia" }}
                        >
                            Administración de Pagos
                        </h1>

                        <p className="mt-2 text-sm text-[#5b3717]">
                            Lista de pagos asociados a los ganadores de las subastas
                        </p>
                    </div>

                    <button
                        onClick={() => navigate("/")}
                        className="rounded px-4 py-2 text-sm font-semibold"
                        style={{
                            backgroundColor: "#845b34",
                            color: "#e8a96e",
                        }}
                    >
                        Volver
                    </button>
                </div>

                {error && (
                    <div className="mb-6 rounded-lg border border-red-200 bg-white p-4 text-red-600">
                        {error}
                    </div>
                )}

                <div className="mb-8 grid gap-4 md:grid-cols-4">
                    <div className="rounded-lg bg-white p-5 shadow">
                        <p className="text-sm font-semibold text-[#5b3717]">
                            Total de pagos
                        </p>
                        <p
                            className="mt-2 text-3xl font-bold text-[#845b34]"
                            style={{ fontFamily: "Georgia" }}
                        >
                            {pagos.length}
                        </p>
                    </div>

                    <div className="rounded-lg bg-white p-5 shadow">
                        <p className="text-sm font-semibold text-[#5b3717]">
                            Pagos pendientes
                        </p>
                        <p
                            className="mt-2 text-3xl font-bold text-red-600"
                            style={{ fontFamily: "Georgia" }}
                        >
                            {totalPendientes}
                        </p>
                    </div>

                    <div className="rounded-lg bg-white p-5 shadow">
                        <p className="text-sm font-semibold text-[#5b3717]">
                            Pagos confirmados
                        </p>
                        <p
                            className="mt-2 text-3xl font-bold text-green-700"
                            style={{ fontFamily: "Georgia" }}
                        >
                            {totalConfirmados}
                        </p>
                    </div>

                    <div className="rounded-lg bg-white p-5 shadow">
                        <p className="text-sm font-semibold text-[#5b3717]">
                            Monto pendiente
                        </p>
                        <p
                            className="mt-2 text-3xl font-bold text-[#845b34]"
                            style={{ fontFamily: "Georgia" }}
                        >
                            ${Number(montoPendiente).toLocaleString()}
                        </p>
                    </div>
                </div>

                <div
                    className="mb-8 rounded-lg p-5 shadow"
                    style={{
                        backgroundColor: "#fdf3e7",
                        border: "1px solid #e8a96e",
                    }}
                >
                    <div className="grid gap-4 md:grid-cols-3">
                        <div>
                            <label className="mb-1 block text-sm font-bold text-[#5b3717]">
                                Filtrar por estado de pago
                            </label>

                            <select
                                value={estadoFiltro}
                                onChange={(e) => setEstadoFiltro(e.target.value)}
                                className="w-full rounded border px-3 py-2 text-sm text-[#5b3717] outline-none"
                                style={{ borderColor: "#845b34" }}
                            >
                                <option value="todos">Todos</option>
                                <option value="1">Pendientes</option>
                                <option value="2">Confirmados</option>
                            </select>
                        </div>

                        <div className="flex items-end">
                            <button
                                onClick={() => setEstadoFiltro("todos")}
                                className="rounded px-4 py-2 text-sm font-semibold"
                                style={{
                                    backgroundColor: "#845b34",
                                    color: "#e8a96e",
                                }}
                            >
                                Limpiar filtro
                            </button>
                        </div>
                    </div>
                </div>

                {pagosFiltrados.length === 0 ? (
                    <div className="rounded-lg bg-white p-6 text-[#845b34] shadow">
                        No hay pagos registrados con el filtro seleccionado.
                    </div>
                ) : (
                    <div className="overflow-x-auto rounded-lg bg-white shadow">
                        <table className="w-full text-sm">
                            <thead>
                                <tr style={{ backgroundColor: "#845b34" }}>
                                    <th className="p-3 text-left text-[#e8a96e]">
                                        Objeto
                                    </th>
                                    <th className="p-3 text-left text-[#e8a96e]">
                                        Ganador
                                    </th>
                                    <th className="p-3 text-left text-[#e8a96e]">
                                        Subasta
                                    </th>
                                    <th className="p-3 text-left text-[#e8a96e]">
                                        Monto
                                    </th>
                                    <th className="p-3 text-left text-[#e8a96e]">
                                        Método
                                    </th>
                                    <th className="p-3 text-left text-[#e8a96e]">
                                        Estado
                                    </th>
                                    <th className="p-3 text-left text-[#e8a96e]">
                                        Fecha asignación
                                    </th>
                                    <th className="p-3 text-left text-[#e8a96e]">
                                        Fecha pago
                                    </th>
                                    <th className="p-3 text-left text-[#e8a96e]">
                                        Acción
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="text-[#5b3717]">
                                {pagosFiltrados.map((pago) => {
                                    const imgUrl = pago.imagen
                                        ? `${API_URL}/uploads/${pago.imagen}`
                                        : null;

                                    const estaConfirmado =
                                        Number(pago.id_estado_pago) === 2 ||
                                        String(pago.estado_pago).toLowerCase() ===
                                        "confirmado";

                                    return (
                                        <tr
                                            key={pago.id_pago}
                                            className="border-b border-gray-100 hover:bg-[#fdf3e7]"
                                        >
                                            <td className="p-3">
                                                <div className="flex items-center gap-3">
                                                    {imgUrl ? (
                                                        <img
                                                            src={imgUrl}
                                                            alt={pago.modelo}
                                                            className="h-14 w-14 rounded border border-[#e8a96e] object-contain"
                                                        />
                                                    ) : (
                                                        <div className="flex h-14 w-14 items-center justify-center rounded border border-[#e8a96e] text-xs text-gray-400">
                                                            Sin imagen
                                                        </div>
                                                    )}

                                                    <div>
                                                        <p className="font-bold text-[#845b34]">
                                                            {pago.modelo || "Sin objeto"}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            {pago.marca || "Sin marca"}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="p-3">
                                                <p className="font-semibold">
                                                    {pago.nombre_ganador || "Sin ganador"}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {pago.correo_ganador || "Sin correo"}
                                                </p>
                                            </td>

                                            <td className="p-3">
                                                #{pago.id_subasta}
                                            </td>

                                            <td className="p-3 font-bold">
                                                ₡{Number(pago.monto || 0).toLocaleString()}
                                            </td>

                                            <td className="p-3">
                                                {pago.metodo_pago || "No definido"}
                                            </td>

                                            <td className="p-3">
                                                <span
                                                    className={[
                                                        "inline-block rounded-full px-3 py-1 text-xs font-bold",
                                                        estaConfirmado
                                                            ? "bg-green-100 text-green-700"
                                                            : "bg-red-100 text-red-600",
                                                    ].join(" ")}
                                                >
                                                    {estaConfirmado
                                                        ? "Confirmado"
                                                        : "Pendiente"}
                                                </span>
                                            </td>

                                            <td className="p-3 text-xs text-gray-500">
                                                {pago.fecha_asignacion || "No disponible"}
                                            </td>

                                            <td className="p-3 text-xs text-gray-500">
                                                {pago.fecha_pago || "No disponible"}
                                            </td>

                                            <td className="p-3">
                                                <button
                                                    onClick={() =>
                                                        navigate(`/subasta/${pago.id_subasta}`)
                                                    }
                                                    className="rounded border px-3 py-1 text-xs font-semibold"
                                                    style={{
                                                        borderColor: "#845b34",
                                                        color: "#845b34",
                                                    }}
                                                >
                                                    Ver subasta
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}

                <div className="mt-6 rounded-lg bg-white p-4 text-sm text-[#5b3717] shadow">
                    <strong>Monto total registrado:</strong>{" "}
                    ${Number(montoTotal).toLocaleString()}
                </div>
            </div>
        </div>
    );
}