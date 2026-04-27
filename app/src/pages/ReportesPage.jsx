import React, { useEffect, useMemo, useState } from "react";
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";

const API_URL = import.meta.env.VITE_API_URL;

const COLOR_CAFE = "#845b34";
const COLOR_DORADO = "#e8a96e";
const COLOR_OSCURO = "#5b3717";
const COLOR_FONDO = "#fdf3e7";

export default function ReportesPage() {
    const [subastas, setSubastas] = useState([]);
    const [pujas, setPujas] = useState([]);

    // Filtros para BarChart
    const [estadoBarFiltro, setEstadoBarFiltro] = useState("todos");
    const [subastaBarFiltro, setSubastaBarFiltro] = useState("todos");

    // Filtros para LineChart
    const [fechaInicio, setFechaInicio] = useState("");
    const [fechaFin, setFechaFin] = useState("");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                setLoading(true);
                setError("");

                const [subastasRes, pujasRes] = await Promise.all([
                    fetch(`${API_URL}/subasta`),
                    fetch(`${API_URL}/puja`),
                ]);

                if (!subastasRes.ok) {
                    throw new Error("Error al cargar las subastas");
                }

                if (!pujasRes.ok) {
                    throw new Error("Error al cargar las pujas");
                }

                const subastasData = await subastasRes.json();
                const pujasData = await pujasRes.json();

                setSubastas(Array.isArray(subastasData) ? subastasData : []);
                setPujas(Array.isArray(pujasData) ? pujasData : []);
            } catch (e) {
                setError(e.message || "Error al cargar los reportes");
            } finally {
                setLoading(false);
            }
        };

        cargarDatos();
    }, []);

    const estadosDisponibles = useMemo(() => {
        const estados = subastas
            .map((s) => s.estado)
            .filter((estado) => estado && estado.trim() !== "");

        return [...new Set(estados)];
    }, [subastas]);

    const dataBarChart = useMemo(() => {
        let lista = [...subastas];

        if (estadoBarFiltro !== "todos") {
            lista = lista.filter(
                (s) =>
                    String(s.estado).toLowerCase() ===
                    estadoBarFiltro.toLowerCase()
            );
        }

        if (subastaBarFiltro !== "todos") {
            lista = lista.filter(
                (s) => Number(s.id_subasta) === Number(subastaBarFiltro)
            );
        }

        // calcular monto más alto por subasta
        const maximosPorSubasta = {};

        pujas.forEach((p) => {
            const id = Number(p.id_subasta);
            const monto = Number(p.monto || 0);

            if (!maximosPorSubasta[id] || monto > maximosPorSubasta[id]) {
                maximosPorSubasta[id] = monto;
            }
        });

        return lista.map((s) => ({
            id_subasta: s.id_subasta,
            modelo: s.modelo,
            estado: s.estado,
            cantidad_pujas: Number(s.cantidad_pujas || 0),
            monto_mas_alto: Number(maximosPorSubasta[s.id_subasta] || 0),
        }));
    }, [subastas, pujas, estadoBarFiltro, subastaBarFiltro]);

    const dataLineChart = useMemo(() => {
        let lista = [...pujas];

        if (fechaInicio) {
            lista = lista.filter((p) => {
                const fechaPuja = new Date(p.fecha_hora);
                const inicio = new Date(fechaInicio);
                return fechaPuja >= inicio;
            });
        }

        if (fechaFin) {
            lista = lista.filter((p) => {
                const fechaPuja = new Date(p.fecha_hora);
                const fin = new Date(fechaFin);
                fin.setHours(23, 59, 59, 999);
                return fechaPuja <= fin;
            });
        }

        lista.sort((a, b) => new Date(a.fecha_hora) - new Date(b.fecha_hora));

        return lista.map((p) => {
            const subastaEncontrada = subastas.find(
                (s) => Number(s.id_subasta) === Number(p.id_subasta)
            );

            return {
                fecha: formatearFecha(p.fecha_hora),
                monto: Number(p.monto || 0),
                usuario: p.usuario,
                subasta: subastaEncontrada
                    ? `#${subastaEncontrada.id_subasta} - ${subastaEncontrada.modelo}`
                    : `Subasta #${p.id_subasta}`,
            };
        });
    }, [pujas, subastas,fechaInicio, fechaFin]);

    const limpiarFiltrosBar = () => {
        setEstadoBarFiltro("todos");
        setSubastaBarFiltro("todos");
    };

    const limpiarFiltrosLine = () => {
        setFechaInicio("");
        setFechaFin("");
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 p-6 font-[Montserrat] text-[#845b34]">
                Cargando reportes...
            </div>
        );
    }

    const CustomBarTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;

            return (
                <div
                    style={{
                        backgroundColor: COLOR_FONDO,
                        border: `1px solid ${COLOR_DORADO}`,
                        padding: "12px",
                        color: COLOR_OSCURO,
                        fontFamily: "Montserrat",
                        borderRadius: "8px",
                    }}
                >
                    <p style={{ fontWeight: "bold", marginBottom: "8px" }}>
                        {label}
                    </p>
                    <p>Cantidad de pujas: {data.cantidad_pujas}</p>
                    <p>Monto más alto: ₡{Number(data.monto_mas_alto).toLocaleString()}</p>
                </div>
            );
        }

        return null;
    };

    const CustomLineTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;

        return (
            <div
                style={{
                    backgroundColor: COLOR_FONDO,
                    border: `1px solid ${COLOR_DORADO}`,
                    padding: "12px",
                    color: COLOR_OSCURO,
                    fontFamily: "Montserrat",
                    borderRadius: "8px",
                }}
            >
                <p style={{ fontWeight: "bold", marginBottom: "8px" }}>
                    Fecha: {label}
                </p>

                <p>Subasta: {data.subasta}</p>
                <p>Monto ofertado: ₡{Number(data.monto).toLocaleString()}</p>
                <p>Usuario: {data.usuario || "No disponible"}</p>
            </div>
        );
    }

    return null;
};

    return (
        <div className="min-h-screen bg-gray-100 font-[Montserrat]">
            <div className="mx-auto max-w-7xl p-6">
                <div className="mb-8">
                    <h1
                        className="text-4xl font-bold text-[#845b34]"
                        style={{ fontFamily: "Georgia" }}
                    >
                        Reportes
                    </h1>

                    <p className="mt-2 text-sm text-[#5b3717]">
                        Visualización gráfica de la actividad de las subastas y
                        evolución de las pujas registradas
                    </p>
                </div>

                {error && (
                    <div className="mb-6 rounded-lg border border-red-200 bg-white p-4 text-red-600">
                        {error}
                    </div>
                )}

                {/* Filtros del BarChart */}
                <div
                    className="mb-8 rounded-lg p-5 shadow"
                    style={{
                        backgroundColor: COLOR_FONDO,
                        border: `1px solid ${COLOR_DORADO}`,
                    }}
                >
                    <div className="mb-4 flex items-center justify-between">
                        <h2
                            className="text-2xl font-bold text-[#845b34]"
                            style={{ fontFamily: "Georgia" }}
                        >
                            Filtros del reporte de pujas por subasta
                        </h2>

                        <button
                            onClick={limpiarFiltrosBar}
                            className="rounded px-4 py-2 text-sm font-semibold"
                            style={{
                                backgroundColor: COLOR_CAFE,
                                color: COLOR_DORADO,
                            }}
                        >
                            Limpiar filtros
                        </button>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <label className="mb-1 block text-sm font-bold text-[#5b3717]">
                                Estado de subasta
                            </label>

                            <select
                                value={estadoBarFiltro}
                                onChange={(e) =>
                                    setEstadoBarFiltro(e.target.value)
                                }
                                className="w-full rounded border px-3 py-2 text-sm text-[#5b3717] outline-none"
                                style={{ borderColor: COLOR_CAFE }}
                            >
                                <option value="todos">Todos</option>
                                {estadosDisponibles.map((estado) => (
                                    <option key={estado} value={estado}>
                                        {estado}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-bold text-[#5b3717]">
                                Subasta
                            </label>

                            <select
                                value={subastaBarFiltro}
                                onChange={(e) =>
                                    setSubastaBarFiltro(e.target.value)
                                }
                                className="w-full rounded border px-3 py-2 text-sm text-[#5b3717] outline-none"
                                style={{ borderColor: COLOR_CAFE }}
                            >
                                <option value="todos">Todas</option>
                                {subastas.map((s) => (
                                    <option
                                        key={s.id_subasta}
                                        value={s.id_subasta}
                                    >
                                        #{s.id_subasta} - {s.modelo}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* BarChart grande */}
                <section className="mb-8 rounded-lg bg-white p-6 shadow">
                    <div className="mb-5">
                        <h2
                            className="text-3xl font-bold text-[#845b34]"
                            style={{ fontFamily: "Georgia" }}
                        >
                            Cantidad de pujas por subasta
                        </h2>

                        <p className="mt-1 text-sm text-[#5b3717]">
                            Este reporte muestra la contidad de pujas recibidas por cada subasta y su monto más alto alcanzado
                        </p>
                    </div>

                    {dataBarChart.length === 0 ? (
                        <div className="rounded border border-[#e8a96e] bg-[#fdf3e7] p-4 text-sm text-[#845b34]">
                            No hay datos para mostrar con el filtro seleccionado.
                        </div>
                    ) : (
                        <div className="h-[520px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={dataBarChart}
                                    margin={{
                                        top: 20,
                                        right: 30,
                                        left: 10,
                                        bottom: 110,
                                    }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />

                                    <XAxis
                                        dataKey="modelo"
                                        tick={{
                                            fontSize: 12,
                                            fill: COLOR_OSCURO,
                                        }}
                                        interval={0}
                                        angle={-35}
                                        textAnchor="end"
                                    />

                                    <YAxis
                                        allowDecimals={false}
                                        tick={{
                                            fontSize: 12,
                                            fill: COLOR_OSCURO,
                                        }}
                                    />

                                    <Tooltip content={<CustomBarTooltip />} />

                                    <Legend verticalAlign="top" height={36} />

                                    <Bar
                                        dataKey="cantidad_pujas"
                                        name="Cantidad de pujas"
                                        fill={COLOR_CAFE}
                                        radius={[8, 8, 0, 0]}
                                        barSize={45}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </section>

                {/* Filtros del LineChart */}
                <div
                    className="mb-8 rounded-lg p-5 shadow"
                    style={{
                        backgroundColor: COLOR_FONDO,
                        border: `1px solid ${COLOR_DORADO}`,
                    }}
                >
                    <div className="mb-4 flex items-center justify-between">
                        <h2
                            className="text-2xl font-bold text-[#845b34]"
                            style={{ fontFamily: "Georgia" }}
                        >
                            Filtros del reporte de evolución de pujas
                        </h2>

                        <button
                            onClick={limpiarFiltrosLine}
                            className="rounded px-4 py-2 text-sm font-semibold"
                            style={{
                                backgroundColor: COLOR_CAFE,
                                color: COLOR_DORADO,
                            }}
                        >
                            Limpiar filtros
                        </button>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <label className="mb-1 block text-sm font-bold text-[#5b3717]">
                                Fecha inicio
                            </label>

                            <input
                                type="date"
                                value={fechaInicio}
                                onChange={(e) => setFechaInicio(e.target.value)}
                                className="w-full rounded border px-3 py-2 text-sm text-[#5b3717] outline-none"
                                style={{ borderColor: COLOR_CAFE }}
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-bold text-[#5b3717]">
                                Fecha fin
                            </label>

                            <input
                                type="date"
                                value={fechaFin}
                                onChange={(e) => setFechaFin(e.target.value)}
                                className="w-full rounded border px-3 py-2 text-sm text-[#5b3717] outline-none"
                                style={{ borderColor: COLOR_CAFE }}
                            />
                        </div>
                    </div>
                </div>

                {/* LineChart grande */}
                <section className="rounded-lg bg-white p-6 shadow">
                    <div className="mb-5">
                        <h2
                            className="text-3xl font-bold text-[#845b34]"
                            style={{ fontFamily: "Georgia" }}
                        >
                            Evolución de montos de pujas
                        </h2>

                        <p className="mt-1 text-sm text-[#5b3717]">
                            Muestra la evolución de los montos ofertados según las pujas registradas en el rango de fechas seleccionadas
                        </p>
                    </div>

                    {dataLineChart.length === 0 ? (
                        <div className="rounded border border-[#e8a96e] bg-[#fdf3e7] p-4 text-sm text-[#845b34]">
                            No hay pujas registradas para el rango seleccionado.
                        </div>
                    ) : (
                        <div className="h-[480px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart
                                    data={dataLineChart}
                                    margin={{
                                        top: 20,
                                        right: 30,
                                        left: 10,
                                        bottom: 40,
                                    }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />

                                    <XAxis
                                        dataKey="fecha"
                                        tick={{
                                            fontSize: 12,
                                            fill: COLOR_OSCURO,
                                        }}
                                    />

                                    <YAxis
                                        tick={{
                                            fontSize: 12,
                                            fill: COLOR_OSCURO,
                                        }}
                                    />

                                    <Tooltip content={<CustomLineTooltip />} />

                                    <Legend verticalAlign="top" height={36} />

                                    <Line
                                        type="monotone"
                                        dataKey="monto"
                                        name="Monto ofertado"
                                        stroke={COLOR_DORADO}
                                        strokeWidth={3}
                                        dot={{ fill: COLOR_CAFE, r: 5 }}
                                        activeDot={{ r: 7 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}

function formatearFecha(fecha) {
    if (!fecha) return "";

    const date = new Date(fecha);

    if (isNaN(date.getTime())) {
        return fecha;
    }

    return date.toLocaleDateString("es-CR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
}