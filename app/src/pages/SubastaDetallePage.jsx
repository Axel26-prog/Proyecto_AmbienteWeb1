import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getSubastaDetalle, getHistorialPujas } from "../services/SubastaServices";
import BrandMenuBar from "../components/Layout/BrandMenuBar";

export default function SubastaDetallePage() {
    const { id } = useParams();
    const [subasta, setSubasta] = useState(null);
    const [pujas, setPujas] = useState([]);
    const [loading, setLoading] = useState(true);

    // Función para parsear fechas de "YYYY-MM-DD HH:MM:SS" a Date válido
    const parseDate = (fechaString) => {
        if (!fechaString) return null;
        const date = new Date(fechaString.replace(" ", "T"));
        return isNaN(date) ? null : date;
    };

    useEffect(() => {
        const cargar = async () => {
            try {
                const detalleResponse = await getSubastaDetalle(id);
                const historialResponse = await getHistorialPujas(id);

                const detalle = detalleResponse?.data || null;
                const historial = historialResponse?.data || [];

                setSubasta(detalle);
                setPujas(historial);
            } catch (e) {
                console.error(e);
                setSubasta(null);
                setPujas([]);
            } finally {
                setLoading(false);
            }
        };

        cargar();
    }, [id]);

    if (loading) return <p className="p-6 text-gray-800">Cargando...</p>;
    if (!subasta) return <p className="p-6 text-gray-800">Subasta no encontrada</p>;

    const imgUrl = subasta.imagen
        ? `${import.meta.env.VITE_API_URL}/uploads/${subasta.imagen}`
        : null;

    return (
        <div className="w-full bg-[#f7f7f7] text-gray-800 min-h-screen">
            <BrandMenuBar />

            <div className="mx-auto max-w-5xl px-4 py-8">
                <h2 className="text-2xl font-bold text-[#5b3717] mb-6">
                    Detalle de Subasta
                </h2>

                {/* INFORMACIÓN DEL OBJETO */}
                <div className="bg-white rounded-xl p-6 border mb-6">
                    <h3 className="font-bold mb-4 text-gray-800">Información del objeto</h3>

                    <div className="flex h-64 items-center justify-center mb-4">
                        {imgUrl ? (
                            <img
                                src={imgUrl}
                                alt={subasta.modelo}
                                className="max-h-full max-w-full object-contain"
                                onError={(e) => {
                                    console.error("No se pudo cargar la imagen:", imgUrl);
                                    e.currentTarget.style.display = "none";
                                }}
                            />
                        ) : (
                            <span className="text-sm text-gray-400">Sin imagen</span>
                        )}
                    </div>

                    <p><b>Nombre:</b> {subasta.modelo || "Sin nombre"}</p>
                    <p><b>Descripción:</b> {subasta.descripcion || "-"}</p>
                    <p><b>Marca:</b> {subasta.marca || "No disponible"}</p>
                    <p><b>Condición:</b> {subasta.condicion || "No disponible"}</p>
                </div>

                {/* DATOS DE LA SUBASTA */}
                <div className="bg-white rounded-xl p-6 border mb-6">
                    <h3 className="font-bold mb-4 text-gray-800">Datos de la Subasta</h3>

                    <p><b>Fecha inicio:</b> {parseDate(subasta.fecha_inicio)?.toLocaleString() || "No disponible"}</p>
                    <p><b>Fecha cierre:</b> {parseDate(subasta.fecha_fin)?.toLocaleString() || "No disponible"}</p>
                    <p><b>Precio base:</b> ${Number(subasta.precio_inicial || 0).toLocaleString()}</p>
                    <p><b>Incremento mínimo:</b> ${Number(subasta.incremento_minimo || 0).toLocaleString()}</p>
                    <p><b>Estado:</b> {subasta.estado || "No disponible"}</p>
                    <p><b>Cantidad de pujas:</b> {Number(subasta.total_pujas || 0)}</p>
                </div>

                {/* HISTORIAL DE PUJAS */}
                <div className="bg-white rounded-xl p-6 border">
                    <h3 className="font-bold mb-4 text-gray-800">Historial de Pujas (orden descendente)</h3>

                    <table className="w-full text-sm text-gray-800">
                        <thead>
                            <tr className="border-b">
                                <th className="text-left">Usuario</th>
                                <th className="text-left">Monto</th>
                                <th className="text-left">Fecha</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pujas.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="text-center text-gray-500 py-4">
                                        No hay pujas aún
                                    </td>
                                </tr>
                            ) : (
                                pujas.map((p) => (
                                    <tr key={p.id_puja} className="border-b">
                                        <td>{p.usuario || "Desconocido"}</td>
                                        <td>${Number(p.monto || 0).toLocaleString()}</td>
                                        <td>{parseDate(p.fecha_puja)?.toLocaleString() || "No disponible"}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}   