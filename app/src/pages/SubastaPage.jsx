import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getRelojesPorMarca } from "../services/RelojService";
import BrandMenuBar from "../components/Layout/BrandMenuBar";
// Para mostrar el nombre de marca arriba según el id:
const MARCA_NAME_BY_ID = {
    1: "Rolex",
    2: "Patek Philippe",
    3: "Cartier",
    4: "Audemars Piguet",
    5: "Ulysse Nardin",
    6: "Franck Muller",
};

export default function SubastaPage() {
    const [params] = useSearchParams();
    const marcaIdRaw = params.get("marca"); // string o null
    const marcaId = marcaIdRaw ? Number(marcaIdRaw) : null;

    const titulo = useMemo(() => {
        if (!marcaId) return "Colecciones";
        return `Colecciones · ${MARCA_NAME_BY_ID[marcaId] ?? "Marca"}`;
    }, [marcaId]);

    const [relojes, setRelojes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let alive = true;

        (async () => {
            try {
                setLoading(true);
                setError("");
                const data = await getRelojesPorMarca(marcaId);
                if (!alive) return;
                setRelojes(Array.isArray(data) ? data : []);
            } catch (e) {
                if (!alive) return;
                setError(e?.message || "Error al cargar relojes");
            } finally {
                if (alive) setLoading(false);
            }
        })();

        return () => {
            alive = false;
        };
    }, [marcaId]);

    return (
        
        <div className="w-full bg-[#f7f7f7]">
            <BrandMenuBar /> 
            <div className="mx-auto w-full max-w-6xl px-4 py-8">
                {/* Título */}
                <h2 className="mb-6 font-[Georgia] text-2xl font-bold text-[#5b3717]">
                    {titulo}
                </h2>

                {/* Estados */}
                {loading && (
                    <p className="font-[Montserrat] text-sm font-semibold text-[#845b34]">
                        Cargando relojes...
                    </p>
                )}

                {!loading && error && (
                    <div className="rounded-lg border border-red-200 bg-white p-4">
                        <p className="font-[Montserrat] text-sm text-red-600">{error}</p>
                    </div>
                )}

                {!loading && !error && relojes.length === 0 && (
                    <div className="rounded-lg border border-[#845b34]/20 bg-white p-4">
                        <p className="font-[Montserrat] text-sm text-[#845b34]">
                            No hay relojes para esta marca.
                        </p>
                    </div>
                )}

                {/* Grid */}
                <div className="mt-6 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
                    {relojes.map((r) => {
                        const imgUrl = `${import.meta.env.VITE_API_URL}/uploads/${r.imagen}`;

                        return (
                            <article key={r.id_reloj} className="w-full">
                                {/* Card imagen con borde */}
                                <div className="rounded-3xl border-2 border-[#845b34] bg-white p-7 shadow-sm">
                                    <div className="flex h-64 items-center justify-center">
                                        <img
                                            src={imgUrl}
                                            alt={r.modelo}
                                            className="max-h-full max-w-full object-contain"
                                            onError={(e) => {
                                                // Si el archivo no existe, no rompe el layout
                                                e.currentTarget.style.display = "none";
                                            }}
                                        />
                                    </div>

                                    {/* Título reloj */}
                                    <h3 className="mt-4 text-center font-[Georgia] text-sm font-semibold text-[#5b3717]">
                                        {r.marca} - {r.modelo}
                                    </h3>

                                    {/* Detalle tipo lista (como tu mockup) */}
                                    <ul className="mt-3 space-y-1 text-left font-[Montserrat] text-xs text-[#5b3717]">
                                        <li>
                                            <span className="font-semibold">Modelo:</span> {r.modelo}
                                        </li>
                                        <li>
                                            <span className="font-semibold">Año:</span>{" "}
                                            {r.anio_fabricacion}
                                        </li>
                                        <li className="line-clamp-2">
                                            <span className="font-semibold">Descripción:</span>{" "}
                                            {r.descripcion}
                                        </li>
                                    </ul>

                                    {/* Pujas */}
                                    <div className="mt-4">
                                        <p className="font-[Montserrat] text-[11px] font-bold tracking-wide text-[#e8a96e]">
                                            PUJA ACTUAL
                                        </p>
                                        <p className="font-[Montserrat] text-sm font-semibold text-[#5b3717]">
                                            ${Number(r.precio_estimado).toLocaleString()}
                                        </p>
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