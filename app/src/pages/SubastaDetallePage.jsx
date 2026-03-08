import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getSubastaDetalle, getHistorialPujas } from "../services/SubastaServices";
import BrandMenuBar from "../components/Layout/BrandMenuBar";

export default function SubastaDetallePage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [subasta, setSubasta] = useState(null);
    const [pujas, setPujas] = useState([]);
    const [loading, setLoading] = useState(true);

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

    if (loading) {
        return (
            <div className="bg-gray-100 min-h-screen font-[Montserrat]">
              
                <div className="p-6">
                    <p className="mt-4 text-gray-600 text-base font-medium">Cargando...</p>
                </div>
            </div>
        );
    }

    if (!subasta) {
        return (
            <div className="bg-gray-100 min-h-screen font-[Montserrat]">
               
                <div className="p-6">
                    <p className="mt-4 text-gray-600 text-base font-medium">
                        Subasta no encontrada
                    </p>
                </div>
            </div>
        );
    }

    const imgUrl = subasta.imagen
        ? `${import.meta.env.VITE_API_URL}/uploads/${subasta.imagen}`
        : null;

    return (
        <div className="bg-gray-100 min-h-screen font-[Montserrat]">
           

            <div className="p-6">
                <div className="flex justify-between items-center mb-8">
                    <h2
                        className="text-3xl font-bold text-[#845b34]"
                        style={{ fontFamily: "Georgia" }}
                    >
                        Detalle de Subasta
                    </h2>

                    <button
                        onClick={() => navigate(-1)}
                        className="px-4 py-2 bg-[#845b34] text-[#e8a96e] rounded font-semibold hover:brightness-110 transition"
                    >
                        ← Volver
                    </button>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    {/* INFORMACIÓN DEL OBJETO */}
                    <div className="bg-white rounded-lg shadow p-6 text-[#1f1f1f]">
                        <h3
                            className="text-2xl font-bold mb-4 text-[#845b34]"
                            style={{ fontFamily: "Georgia" }}
                        >
                            Información del objeto
                        </h3>

                        <div className="h-80 bg-white flex items-center justify-center overflow-hidden p-4 mb-6 rounded">
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

                        <p className="mb-3">
                            <strong style={{ fontFamily: "Georgia" }}>Nombre:</strong>{" "}
                            <span style={{ fontFamily: "Montserrat, sans-serif", color: "#1f1f1f" }}>
                                {subasta.modelo || "Sin nombre"}
                            </span>
                        </p>

                        <p className="mb-3">
                            <strong style={{ fontFamily: "Georgia" }}>Descripción:</strong>{" "}
                            <span style={{ fontFamily: "Montserrat, sans-serif", color: "#1f1f1f"  }}>
                                {subasta.descripcion || "-"}
                            </span>
                        </p>

                        <p className="mb-3">
                            <strong style={{ fontFamily: "Georgia" }}>Marca:</strong>{" "}
                            <span style={{ fontFamily: "Montserrat, sans-serif", color: "#1f1f1f"  }}>
                                {subasta.marca || "No disponible"}
                            </span>
                        </p>

                        <p>
                            <strong style={{ fontFamily: "Georgia" }}>Condición:</strong>{" "}
                            <span style={{ fontFamily: "Montserrat, sans-serif", color: "#1f1f1f"  }}>
                                {subasta.condicion || "No disponible"}
                            </span>
                        </p>
                    </div>

                    {/* DATOS DE LA SUBASTA */}
                    <div className="bg-white rounded-lg shadow p-6 text-[#1f1f1f]">
                        <h3
                            className="text-2xl font-bold mb-4 text-[#845b34]"
                            style={{ fontFamily: "Georgia" }}
                        >
                            Datos de la Subasta
                        </h3>

                        <p className="mb-3">
                            <strong style={{ fontFamily: "Georgia" }}>Fecha inicio:</strong>{" "}
                            <span style={{ fontFamily: "Montserrat, sans-serif", color: "#1f1f1f"  }}>
                                {parseDate(subasta.fecha_inicio)?.toLocaleString() || "No disponible"}
                            </span>
                        </p>

                        <p className="mb-3">
                            <strong style={{ fontFamily: "Georgia" }}>Fecha cierre:</strong>{" "}
                            <span style={{ fontFamily: "Montserrat, sans-serif", color: "#1f1f1f"  }}>
                                {parseDate(subasta.fecha_fin)?.toLocaleString() || "No disponible"}
                            </span>
                        </p>

                        <p className="mb-3">
                            <strong style={{ fontFamily: "Georgia" }}>Precio base:</strong>{" "}
                            <span style={{ fontFamily: "Montserrat, sans-serif", color: "#1f1f1f"  }}>
                                ${Number(subasta.precio_inicial || 0).toLocaleString()}
                            </span>
                        </p>

                        <p className="mb-3">
                            <strong style={{ fontFamily: "Georgia" }}>Incremento mínimo:</strong>{" "}
                            <span style={{ fontFamily: "Montserrat, sans-serif" , color: "#1f1f1f" }}>
                                ${Number(subasta.incremento_minimo || 0).toLocaleString()}
                            </span>
                        </p>

                        <p className="mb-3">
                            <strong style={{ fontFamily: "Georgia" }}>Estado:</strong>{" "}
                            <span style={{ fontFamily: "Montserrat, sans-serif" , color: "#1f1f1f" }}>
                                {subasta.estado || "No disponible"}
                            </span>
                        </p>

                        <p>
                            <strong style={{ fontFamily: "Georgia" }}>Cantidad de pujas:</strong>{" "}
                            <span style={{ fontFamily: "Montserrat, sans-serif", color: "#1f1f1f"  }}>
                                {Number(subasta.total_pujas || 0)}
                            </span>
                        </p>
                    </div>
                </div>

                {/* HISTORIAL DE PUJAS */}
                <div className="mt-8 bg-white rounded-lg shadow p-6 overflow-x-auto text-[#1f1f1f]">
                    <h3
                        className="text-2xl font-bold mb-4 text-[#845b34]"
                        style={{ fontFamily: "Georgia" }}
                    >
                        Historial de Pujas
                    </h3>

                    <table className="w-full text-base text-left">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th
                                    className="py-3 pr-4 text-[#845b34]"
                                    style={{ fontFamily: "Georgia" }}
                                >
                                    Usuario
                                </th>
                                <th
                                    className="py-3 pr-4 text-[#845b34]"
                                    style={{ fontFamily: "Georgia" }}
                                >
                                    Monto
                                </th>
                                <th
                                    className="py-3 pr-4 text-[#845b34]"
                                    style={{ fontFamily: "Georgia" }}
                                >
                                    Fecha
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {pujas.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={3}
                                        className="py-4 text-center text-gray-500"
                                        style={{ fontFamily: "Montserrat, sans-serif" }}
                                    >
                                        No hay pujas aún
                                    </td>
                                </tr>
                            ) : (
                                pujas.map((p) => (
                                    <tr key={p.id_puja} className="border-b border-gray-100">
                                        <td
                                            className="py-3 pr-4"
                                            style={{ fontFamily: "Montserrat, sans-serif" }}
                                        >
                                            {p.usuario || "Desconocido"}
                                        </td>
                                        <td
                                            className="py-3 pr-4"
                                            style={{ fontFamily: "Montserrat, sans-serif" }}
                                        >
                                            ${Number(p.monto || 0).toLocaleString()}
                                        </td>
                                        <td
                                            className="py-3 pr-4"
                                            style={{ fontFamily: "Montserrat, sans-serif" }}
                                        >
                                           {parseDate(p.fecha_hora)?.toLocaleString() || "No disponible"}
                                        </td>
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