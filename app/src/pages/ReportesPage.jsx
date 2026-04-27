import React, { useEffect, useMemo, useState } from "react";
import {
    BarChart, Bar, LineChart, Line,
    XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, Legend,
} from "recharts";

const API_URL = import.meta.env.VITE_API_URL;

const COLOR_CAFE   = "#845b34";
const COLOR_DORADO = "#e8a96e";
const COLOR_OSCURO = "#5b3717";
const COLOR_FONDO  = "#fdf3e7";

function CustomBarTooltip({ active, payload, label }) {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div style={{ backgroundColor: COLOR_FONDO, border: "1px solid " + COLOR_DORADO, padding: "12px", color: COLOR_OSCURO, fontFamily: "Montserrat", borderRadius: "8px" }}>
                <p style={{ fontWeight: "bold", marginBottom: "8px" }}>{label}</p>
                <p>Cantidad de pujas: {data.cantidad_pujas}</p>
                <p>Monto mas alto: {Number(data.monto_mas_alto).toLocaleString()}</p>
            </div>
        );
    }
    return null;
}

function CustomLineTooltip({ active, payload, label }) {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div style={{ backgroundColor: COLOR_FONDO, border: "1px solid " + COLOR_DORADO, padding: "12px", color: COLOR_OSCURO, fontFamily: "Montserrat", borderRadius: "8px" }}>
                <p style={{ fontWeight: "bold", marginBottom: "8px" }}>Fecha: {label}</p>
                <p>Subasta: {data.subasta}</p>
                <p>Monto ofertado: {Number(data.monto).toLocaleString()}</p>
                <p>Usuario: {data.usuario || "No disponible"}</p>
            </div>
        );
    }
    return null;
}

function formatearFecha(fecha) {
    if (!fecha) return "";
    const date = new Date(fecha);
    if (isNaN(date.getTime())) return fecha;
    return date.toLocaleDateString("es-CR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export default function ReportesPage() {
    const [subastas, setSubastas] = useState([]);
    const [pujas, setPujas] = useState([]);
    const [estadoBarFiltro, setEstadoBarFiltro] = useState("todos");
    const [subastaBarFiltro, setSubastaBarFiltro] = useState("todos");
    const [fechaInicio, setFechaInicio] = useState("");
    const [fechaFin, setFechaFin] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                setLoading(true);
                setError("");
                const token = localStorage.getItem("token");
                const headers = {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: "Bearer " + token } : {}),
                };
                const [subastasRes, pujasRes] = await Promise.all([
                    fetch(API_URL + "/subasta", { headers }),
                    fetch(API_URL + "/puja", { headers }),
                ]);
                if (!subastasRes.ok) throw new Error("Error al cargar las subastas");
                if (!pujasRes.ok) throw new Error("Error al cargar las pujas");
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
        const estados = subastas.map((s) => s.estado).filter((e) => e && e.trim() !== "");
        return [...new Set(estados)];
    }, [subastas]);

    const dataBarChart = useMemo(() => {
        let lista = [...subastas];
        if (estadoBarFiltro !== "todos") lista = lista.filter((s) => String(s.estado).toLowerCase() === estadoBarFiltro.toLowerCase());
        if (subastaBarFiltro !== "todos") lista = lista.filter((s) => Number(s.id_subasta) === Number(subastaBarFiltro));
        const maximosPorSubasta = {};
        pujas.forEach((p) => {
            const id = Number(p.id_subasta);
            const monto = Number(p.monto || 0);
            if (!maximosPorSubasta[id] || monto > maximosPorSubasta[id]) maximosPorSubasta[id] = monto;
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
        if (fechaInicio) lista = lista.filter((p) => new Date(p.fecha_hora) >= new Date(fechaInicio));
        if (fechaFin) {
            lista = lista.filter((p) => {
                const fin = new Date(fechaFin);
                fin.setHours(23, 59, 59, 999);
                return new Date(p.fecha_hora) <= fin;
            });
        }
        lista.sort((a, b) => new Date(a.fecha_hora) - new Date(b.fecha_hora));
        return lista.map((p) => {
            const s = subastas.find((s) => Number(s.id_subasta) === Number(p.id_subasta));
            return {
                fecha: formatearFecha(p.fecha_hora),
                monto: Number(p.monto || 0),
                usuario: p.usuario,
                subasta: s ? "#" + s.id_subasta + " - " + s.modelo : "Subasta #" + p.id_subasta,
            };
        });
    }, [pujas, subastas, fechaInicio, fechaFin]);

    if (loading) return <div style={{ padding: "24px", color: COLOR_CAFE, fontFamily: "Montserrat" }}>Cargando reportes...</div>;

    return (
        <div style={{ minHeight: "100vh", backgroundColor: "#f3f4f6", fontFamily: "Montserrat" }}>
            <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "24px" }}>

                <div style={{ marginBottom: "32px" }}>
                    <h1 style={{ fontSize: "2rem", fontWeight: "bold", color: COLOR_CAFE, fontFamily: "Georgia" }}>Reportes</h1>
                    <p style={{ marginTop: "8px", fontSize: "0.875rem", color: COLOR_OSCURO }}>Visualizacion grafica de la actividad de las subastas y evolucion de las pujas registradas</p>
                </div>

                {error && <div style={{ marginBottom: "24px", padding: "16px", border: "1px solid #fecaca", borderRadius: "8px", backgroundColor: "white", color: "#dc2626" }}>{error}</div>}

                {/* Filtros BarChart */}
                <div style={{ marginBottom: "32px", borderRadius: "8px", padding: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", backgroundColor: COLOR_FONDO, border: "1px solid " + COLOR_DORADO }}>
                    <div style={{ marginBottom: "16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: COLOR_CAFE, fontFamily: "Georgia" }}>Filtros del reporte de pujas por subasta</h2>
                        <button onClick={() => { setEstadoBarFiltro("todos"); setSubastaBarFiltro("todos"); }} style={{ backgroundColor: COLOR_CAFE, color: COLOR_DORADO, padding: "8px 16px", borderRadius: "4px", border: "none", cursor: "pointer", fontSize: "0.875rem", fontWeight: "600" }}>Limpiar filtros</button>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                        <div>
                            <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "bold", color: COLOR_OSCURO, marginBottom: "4px" }}>Estado de subasta</label>
                            <select value={estadoBarFiltro} onChange={(e) => setEstadoBarFiltro(e.target.value)} style={{ width: "100%", borderRadius: "4px", border: "1px solid " + COLOR_CAFE, padding: "8px 12px", fontSize: "0.875rem", color: COLOR_OSCURO, outline: "none" }}>
                                <option value="todos">Todos</option>
                                {estadosDisponibles.map((estado) => <option key={estado} value={estado}>{estado}</option>)}
                            </select>
                        </div>
                        <div>
                            <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "bold", color: COLOR_OSCURO, marginBottom: "4px" }}>Subasta</label>
                            <select value={subastaBarFiltro} onChange={(e) => setSubastaBarFiltro(e.target.value)} style={{ width: "100%", borderRadius: "4px", border: "1px solid " + COLOR_CAFE, padding: "8px 12px", fontSize: "0.875rem", color: COLOR_OSCURO, outline: "none" }}>
                                <option value="todos">Todas</option>
                                {subastas.map((s) => <option key={s.id_subasta} value={s.id_subasta}>#{s.id_subasta} - {s.modelo}</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                {/* BarChart */}
                <div style={{ marginBottom: "32px", borderRadius: "8px", backgroundColor: "white", padding: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                    <div style={{ marginBottom: "20px" }}>
                        <h2 style={{ fontSize: "1.75rem", fontWeight: "bold", color: COLOR_CAFE, fontFamily: "Georgia" }}>Cantidad de pujas por subasta</h2>
                        <p style={{ marginTop: "4px", fontSize: "0.875rem", color: COLOR_OSCURO }}>Muestra la cantidad de pujas recibidas por cada subasta y su monto mas alto alcanzado</p>
                    </div>
                    {dataBarChart.length === 0 ? (
                        <div style={{ padding: "16px", border: "1px solid " + COLOR_DORADO, backgroundColor: COLOR_FONDO, borderRadius: "4px", fontSize: "0.875rem", color: COLOR_CAFE }}>No hay datos para mostrar con el filtro seleccionado.</div>
                    ) : (
                        <div style={{ width: "100%", height: 520 }}>
                            <ResponsiveContainer width="100%" height={520}>
                                <BarChart data={dataBarChart} margin={{ top: 20, right: 30, left: 10, bottom: 110 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="modelo" tick={{ fontSize: 12, fill: COLOR_OSCURO }} interval={0} angle={-35} textAnchor="end" />
                                    <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: COLOR_OSCURO }} />
                                    <Tooltip content={<CustomBarTooltip />} />
                                    <Legend verticalAlign="top" height={36} />
                                    <Bar dataKey="cantidad_pujas" name="Cantidad de pujas" fill={COLOR_CAFE} radius={[8, 8, 0, 0]} barSize={45} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </div>

                {/* Filtros LineChart */}
                <div style={{ marginBottom: "32px", borderRadius: "8px", padding: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", backgroundColor: COLOR_FONDO, border: "1px solid " + COLOR_DORADO }}>
                    <div style={{ marginBottom: "16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: COLOR_CAFE, fontFamily: "Georgia" }}>Filtros del reporte de evolucion de pujas</h2>
                        <button onClick={() => { setFechaInicio(""); setFechaFin(""); }} style={{ backgroundColor: COLOR_CAFE, color: COLOR_DORADO, padding: "8px 16px", borderRadius: "4px", border: "none", cursor: "pointer", fontSize: "0.875rem", fontWeight: "600" }}>Limpiar filtros</button>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                        <div>
                            <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "bold", color: COLOR_OSCURO, marginBottom: "4px" }}>Fecha inicio</label>
                            <input type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} style={{ width: "100%", borderRadius: "4px", border: "1px solid " + COLOR_CAFE, padding: "8px 12px", fontSize: "0.875rem", color: COLOR_OSCURO, outline: "none" }} />
                        </div>
                        <div>
                            <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "bold", color: COLOR_OSCURO, marginBottom: "4px" }}>Fecha fin</label>
                            <input type="date" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} style={{ width: "100%", borderRadius: "4px", border: "1px solid " + COLOR_CAFE, padding: "8px 12px", fontSize: "0.875rem", color: COLOR_OSCURO, outline: "none" }} />
                        </div>
                    </div>
                </div>

                {/* LineChart */}
                <div style={{ borderRadius: "8px", backgroundColor: "white", padding: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                    <div style={{ marginBottom: "20px" }}>
                        <h2 style={{ fontSize: "1.75rem", fontWeight: "bold", color: COLOR_CAFE, fontFamily: "Georgia" }}>Evolucion de montos de pujas</h2>
                        <p style={{ marginTop: "4px", fontSize: "0.875rem", color: COLOR_OSCURO }}>Muestra la evolucion de los montos ofertados segun las pujas registradas en el rango de fechas seleccionadas</p>
                    </div>
                    {dataLineChart.length === 0 ? (
                        <div style={{ padding: "16px", border: "1px solid " + COLOR_DORADO, backgroundColor: COLOR_FONDO, borderRadius: "4px", fontSize: "0.875rem", color: COLOR_CAFE }}>No hay pujas registradas para el rango seleccionado.</div>
                    ) : (
                        <div style={{ width: "100%", height: 480 }}>
                            <ResponsiveContainer width="100%" height={480}>
                                <LineChart data={dataLineChart} margin={{ top: 20, right: 30, left: 10, bottom: 40 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="fecha" tick={{ fontSize: 12, fill: COLOR_OSCURO }} />
                                    <YAxis tick={{ fontSize: 12, fill: COLOR_OSCURO }} />
                                    <Tooltip content={<CustomLineTooltip />} />
                                    <Legend verticalAlign="top" height={36} />
                                    <Line type="monotone" dataKey="monto" name="Monto ofertado" stroke={COLOR_DORADO} strokeWidth={3} dot={{ fill: COLOR_CAFE, r: 5 }} activeDot={{ r: 7 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}