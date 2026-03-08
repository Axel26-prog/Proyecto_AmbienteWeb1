import React, { useEffect, useState } from "react";
import { getSubastasActivas, getSubastasFinalizadas } from "../services/SubastaServices";
import BrandMenuBar from "../components/Layout/BrandMenuBar";
import { useNavigate } from "react-router-dom";

export default function SubastaPage() {

    const [subastas, setSubastas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [mostrarFinalizadas, setMostrarFinalizadas] = useState(false);
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

        <div className="w-full bg-[#f7f7f7]">

            <BrandMenuBar />

            <div className="mx-auto w-full max-w-6xl px-4 py-8">

                <div className="flex items-center justify-between mb-6">

                    <h2 className="font-[Georgia] text-2xl font-bold text-[#5b3717]">
                        {mostrarFinalizadas ? "Subastas Finalizadas" : "Subastas Activas"}
                    </h2>

                    <button
                        onClick={() => setMostrarFinalizadas(!mostrarFinalizadas)}
                        className="rounded-lg bg-[#845b34] px-4 py-2 text-white font-[Montserrat] text-sm hover:bg-[#6f4726]"
                    >
                        {mostrarFinalizadas
                            ? "Ver subastas activas"
                            : "Ver subastas finalizadas"}
                    </button>

                </div>

                {loading && (
                    <p className="font-[Montserrat] text-sm font-semibold text-[#845b34]">
                        Cargando subastas...
                    </p>
                )}

                {!loading && error && (
                    <div className="rounded-lg border border-red-200 bg-white p-4">
                        <p className="font-[Montserrat] text-sm text-red-600">
                            {error}
                        </p>
                    </div>
                )}

                {!loading && !error && subastas.length === 0 && (
                    <div className="rounded-lg border border-[#845b34]/20 bg-white p-4">
                        <p className="font-[Montserrat] text-sm text-[#845b34]">
                            No hay subastas disponibles.
                        </p>
                    </div>
                )}

                <div className="mt-6 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">

                    {subastas.map((s) => {

                        const imgUrl = s.imagen
                            ? `${import.meta.env.VITE_API_URL}/uploads/${s.imagen}`
                            : null;

                        return (

                            <article key={s.id_subasta} className="w-full">

                                <div className="rounded-3xl border-2 border-[#845b34] bg-white p-7 shadow-sm">

                                    <div className="flex h-64 items-center justify-center">

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
                                            <span className="text-sm text-gray-400">
                                                Sin imagen
                                            </span>
                                        )}

                                    </div>

                                    <h3 className="mt-4 text-center font-[Georgia] text-sm font-semibold text-[#5b3717]">
                                        {s.modelo || "Reloj"}
                                    </h3>

                                    <ul className="mt-3 space-y-1 text-left font-[Montserrat] text-xs text-[#5b3717]">

                                        {mostrarFinalizadas ? (
                                            <>
                                                <li>
                                                    <span className="font-semibold">Fecha cierre:</span>{" "}
                                                    {s.fecha_cierre
                                                        ? new Date(s.fecha_cierre).toLocaleDateString()
                                                        : "-"}
                                                </li>

                                                <li>
                                                    <span className="font-semibold">Pujas:</span>{" "}
                                                    {s.cantidad_pujas ?? 0}
                                                </li>

                                                <li>
                                                    <span className="font-semibold">Estado:</span>{" "}
                                                    {s.estado_final || "Finalizada"}
                                                </li>
                                            </>
                                        ) : (
                                            <>
                                                <li>
                                                    <span className="font-semibold">Inicio:</span>{" "}
                                                    {s.fecha_inicio
                                                        ? new Date(s.fecha_inicio).toLocaleDateString()
                                                        : "-"}
                                                </li>

                                                <li>
                                                    <span className="font-semibold">Cierre:</span>{" "}
                                                    {s.fecha_estimada_cierre
                                                        ? new Date(s.fecha_estimada_cierre).toLocaleDateString()
                                                        : "-"}
                                                </li>

                                                <li>
                                                    <span className="font-semibold">Precio base:</span>{" "}
                                                    ${Number(s.precio_inicial || 0).toLocaleString()}
                                                </li>

                                                <li>
                                                    <span className="font-semibold">Incremento mínimo:</span>{" "}
                                                    ${Number(s.incremento_minimo || 0).toLocaleString()}
                                                </li>
                                            </>
                                        )}

                                    </ul>

                                    <div className="mt-4">

                                        <p className="font-[Montserrat] text-[11px] font-bold tracking-wide text-[#e8a96e]">
                                            PUJAS
                                        </p>

                                        <p className="font-[Montserrat] text-sm font-semibold text-[#5b3717]">
                                            {s.cantidad_pujas ?? 0}
                                        </p>

                                    </div>
                                            <div className="mt-4 flex justify-center">
                                                <button
                                                 onClick={() => navigate(`/subasta/${s.id_subasta}`)}
                                                 className="rounded-lg bg-[#845b34] px-4 py-2 text-white text-sm hover:bg-[#6f4726]"
                                                >
                                                   Ver detalle
                                                </button>
                                            </div>
                                </div>

                            </article>

                        );

                    })}

                </div>

            </div>

        </div>

    );
}