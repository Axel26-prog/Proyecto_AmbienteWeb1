import React, { useEffect, useState } from "react";
import { getSubastasActivas, getSubastasFinalizadas } from "../services/SubastaServices";
import BrandMenuBar from "../components/Layout/BrandMenuBar";
import { useNavigate } from "react-router-dom";

export default function SubastaPage({ tipo = "activas" }) {
    const [subastas, setSubastas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const mostrarFinalizadas = tipo === "inactivas";
    const navigate = useNavigate();

    useEffect(() => {
        let alive = true;

        const cargarSubastas = async () => {
            try {
                setLoading(true);
                setError("");

                const data = mostrarFinalizadas
                    ? await getSubastasFinalizadas()
                    : await getSubastasActivas();

                if (!alive) return;

                const lista = Array.isArray(data) ? data : data?.data || [];
                setSubastas(lista);
            } catch (e) {
                if (!alive) return;
                setError(e?.message || "Error al cargar subastas");
            } finally {
                if (alive) setLoading(false);
            }
        };

        cargarSubastas();

        return () => {
            alive = false;
        };
    }, [mostrarFinalizadas]);

    return (
        <div className="bg-gray-100 min-h-screen font-[Montserrat]">
            <BrandMenuBar />

            <div className="p-6">
                <h2
                    className="text-3xl font-bold mb-8 text-[#845b34]"
                    style={{ fontFamily: "Georgia" }}
                >
                    {mostrarFinalizadas ? "Subastas Finalizadas" : "Subastas Activas"}
                </h2>

                {loading && (
                    <p className="mt-4 text-gray-600 text-base font-medium">
                        Cargando subastas...
                    </p>
                )}

                {!loading && error && (
                    <div className="rounded-lg border border-red-200 bg-white p-4">
                        <p className="font-[Montserrat] text-sm text-red-600">{error}</p>
                    </div>
                )}

                {!loading && !error && subastas.length === 0 && (
                    <div className="rounded-lg border border-[#845b34]/20 bg-white p-4">
                        <p className="font-[Montserrat] text-sm text-[#845b34]">
                            No hay subastas disponibles.
                        </p>
                    </div>
                )}

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {subastas.map((s) => {
                        const imgUrl = s.imagen
                            ? `${import.meta.env.VITE_API_URL}/uploads/${s.imagen}`
                            : null;

                        return (
                            <div
                                key={s.id_subasta}
                                className="bg-white rounded-lg shadow hover:shadow-xl transition overflow-hidden"
                            >
                                {/* IMAGEN */}
                                <div className="h-56 bg-white flex items-center justify-center overflow-hidden p-4">
                                    {imgUrl ? (
                                        <img
                                            src={imgUrl}
                                            alt={s.modelo}
                                            className="max-h-full max-w-full object-contain"
                                            onError={(e) => {
                                                e.currentTarget.style.display = "none";
                                            }}
                                        />
                                    ) : (
                                        <span className="text-sm text-gray-400">Sin imagen</span>
                                    )}
                                </div>

                                {/* CONTENIDO */}
                                <div className="p-5 text-gray-900">
                                    <h3
                                        className="text-xl font-bold mb-2 text-[#845b34]"
                                        style={{ fontFamily: "Georgia" }}
                                    >
                                        {s.modelo || "Reloj"}
                                    </h3>

                                    {mostrarFinalizadas ? (
                                        <>
                                            <p className="text-base mb-1">
                                                <strong style={{ fontFamily: "Georgia" }}>Fecha cierre:</strong>{" "}
                                                <span style={{ fontFamily: "Montserrat, sans-serif" }}>
                                                    {s.fecha_cierre
                                                        ? new Date(s.fecha_cierre).toLocaleDateString()
                                                        : "-"}
                                                </span>
                                            </p>

                                            <p className="text-base mb-1">
                                                <strong style={{ fontFamily: "Georgia" }}>Pujas:</strong>{" "}
                                                <span style={{ fontFamily: "Montserrat, sans-serif" }}>
                                                    {s.cantidad_pujas ?? 0}
                                                </span>
                                            </p>

                                            <p className="text-base mb-3">
                                                <strong style={{ fontFamily: "Georgia" }}>Estado:</strong>{" "}
                                                <span style={{ fontFamily: "Montserrat, sans-serif" }}>
                                                    {s.estado_final || "Finalizada"}
                                                </span>
                                            </p>
                                        </>
                                    ) : (
                                        <>
                                            <p className="text-base mb-1">
                                                <strong style={{ fontFamily: "Georgia" }}>Inicio:</strong>{" "}
                                                <span style={{ fontFamily: "Montserrat, sans-serif" }}>
                                                    {s.fecha_inicio
                                                        ? new Date(s.fecha_inicio).toLocaleDateString()
                                                        : "-"}
                                                </span>
                                            </p>

                                            <p className="text-base mb-1">
                                                <strong style={{ fontFamily: "Georgia" }}>Cierre:</strong>{" "}
                                                <span style={{ fontFamily: "Montserrat, sans-serif" }}>
                                                    {s.fecha_estimada_cierre
                                                        ? new Date(s.fecha_estimada_cierre).toLocaleDateString()
                                                        : "-"}
                                                </span>
                                            </p>

                                            <p className="text-base mb-1">
                                                <strong style={{ fontFamily: "Georgia" }}>Precio base:</strong>{" "}
                                                <span style={{ fontFamily: "Montserrat, sans-serif" }}>
                                                    ${Number(s.precio_inicial || 0).toLocaleString()}
                                                </span>
                                            </p>

                                            <p className="text-base mb-3">
                                                <strong style={{ fontFamily: "Georgia" }}>Incremento mínimo:</strong>{" "}
                                                <span style={{ fontFamily: "Montserrat, sans-serif" }}>
                                                    ${Number(s.incremento_minimo || 0).toLocaleString()}
                                                </span>
                                            </p>
                                        </>
                                    )}

                                    <p className="text-base mb-3">
                                        <strong style={{ fontFamily: "Georgia" }}>Pujas:</strong>{" "}
                                        <span style={{ fontFamily: "Montserrat, sans-serif" }}>
                                            {s.cantidad_pujas ?? 0}
                                        </span>
                                    </p>

                                    <button
                                        onClick={() => navigate(`/subasta/${s.id_subasta}`)}
                                        className="w-full bg-[#845b34] text-[#e8a96e] py-3 rounded font-semibold hover:brightness-110 transition"
                                    >
                                        Ver Detalle
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}