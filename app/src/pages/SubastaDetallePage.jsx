import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Pusher from "pusher-js";
import {
  getSubastaDetalle,
  getHistorialPujas,
} from "../services/SubastaServices";

const API_URL = import.meta.env.VITE_API_URL;
const ID_USUARIO_COMPRADOR = 4;

export default function SubastaDetallePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [subasta, setSubasta] = useState(null);
  const [pujas, setPujas] = useState([]);
  const [pujaMasAlta, setPujaMasAlta] = useState(0);
  const [usuarioLider, setUsuarioLider] = useState(null);
  const [monto, setMonto] = useState("");
  const [loading, setLoading] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");
  const [notificacion, setNotificacion] = useState("");
  const [ganador, setGanador] = useState(null);
  const [subastaCerrada, setSubastaCerrada] = useState(false);
  const [tiempoRestante, setTiempoRestante] = useState("");
  const [pago, setPago] = useState(null);
  const [confirmando, setConfirmando] = useState(false);
  const [nombreComprador, setNombreComprador] = useState("");

  const pusherRef = useRef(null);
  const channelRef = useRef(null);
  const timerRef = useRef(null);
  const nombreRef = useRef(""); 
  /* ── Cargar datos ── */
  useEffect(() => {
    cargar();
    return () => {
      channelRef.current?.unbind_all();
      pusherRef.current?.disconnect();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [id]);

  const cargar = async () => {
    try {
      setLoading(true);

      const [detalleRes, historialRes, usuarioRes] = await Promise.all([
        getSubastaDetalle(id),
        getHistorialPujas(id),
        fetch(`${API_URL}/usuario/${ID_USUARIO_COMPRADOR}`).then((r) =>
          r.json(),
        ),
      ]);
      console.log("USUARIO:", usuarioRes);

      const detalle = detalleRes || null;
      const historial = Array.isArray(historialRes?.data)
        ? historialRes.data.sort((a, b) => Number(b.monto) - Number(a.monto))
        : [];

      /* Nombre real del comprador */
      const usuario = usuarioRes.data;

      if (usuario && usuario.nombre) {
        const nombre = `${usuario.nombre} ${usuario.apellido}`;
        setNombreComprador(nombre);
        nombreRef.current = nombre;
      }

      setSubasta(detalle);
      setPujas(historial);

      /* Puja más alta */
      if (historial.length > 0) {
        const maxPuja = historial.reduce(
          (max, p) => (Number(p.monto) > Number(max.monto) ? p : max),
          historial[0],
        );
        setPujaMasAlta(Number(maxPuja.monto));
        setUsuarioLider(maxPuja.usuario);
      } else if (detalle) {
        setPujaMasAlta(Number(detalle.precio_inicial));
      }

      /* Verificar si ya cerró */
      if (detalle) {
        const ahora = new Date();
        const fin = new Date(detalle.fecha_fin.replace(" ", "T"));
        if (ahora >= fin || detalle.estado?.toLowerCase() === "cerrada") {
          setSubastaCerrada(true);
          setTiempoRestante("Subasta cerrada");
          await cargarGanadorYPago();
        } else {
          iniciarContador(detalle.fecha_fin);
        }
        iniciarPusher();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const cargarGanadorYPago = async () => {
    try {
      const ganadorRes = await fetch(`${API_URL}/ganador/getBySubasta/${id}`);
      const ganadorData = await ganadorRes.json();
      if (ganadorData && ganadorData.id_ganador) {
        setGanador(ganadorData);
        /* Buscar pago del ganador */
        const pagoRes = await fetch(
          `${API_URL}/pago/getByGanador/${ganadorData.id_ganador}`,
        );
        const pagoData = await pagoRes.json();
        if (pagoData && pagoData.length > 0) setPago(pagoData[0]);
      }
    } catch (e) {
      console.error("Error cargando ganador/pago", e);
    }
  };

  /* ── Contador ── */
  const iniciarContador = (fechaFin) => {
    if (timerRef.current) clearInterval(timerRef.current);
    const calcular = () => {
      const diff = new Date(fechaFin.replace(" ", "T")) - new Date();
      if (diff <= 0) {
        setTiempoRestante("Subasta cerrada");
        setSubastaCerrada(true);
        clearInterval(timerRef.current);
        cargarGanadorYPago();
        return;
      }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTiempoRestante(`${h}h ${m}m ${s}s`);
    };
    calcular();
    timerRef.current = setInterval(calcular, 1000);
  };

  /* ── Pusher ── */
  const iniciarPusher = () => {
    pusherRef.current = new Pusher("f286856de296137ede61", { cluster: "us2" });
    channelRef.current = pusherRef.current.subscribe(`subasta-${id}`);

    
    channelRef.current.bind("nueva-puja", (data) => {
      setPujas((prev) => {
        /* Evitar duplicado: si ya existe una puja con el mismo monto, usuario y fecha similar, no agregar */
        const yaExiste = prev.some(
          (p) =>
            Number(p.monto) === Number(data.monto) &&
            p.id_usuario === data.id_usuario &&
            p.fecha_hora === data.fecha_hora,
        );
        if (yaExiste) return prev;
        return [
          {
            usuario: data.usuario,
            monto: data.monto,
            fecha_hora: data.fecha_hora,
            id_usuario: data.id_usuario,
          },
          ...prev,
        ];
      });
      setPujaMasAlta(Number(data.monto));
      setUsuarioLider(data.usuario);

      /* Notificación si el usuario actual fue superado */
      if (data.id_usuario !== ID_USUARIO_COMPRADOR) {
        setNotificacion("⚠️ Tu puja ha sido superada por otro usuario");
        setTimeout(() => setNotificacion(""), 6000);
      }
    });

    /* Subasta cerrada */
    channelRef.current.bind("subasta-cerrada", async () => {
      setSubastaCerrada(true);
      setTiempoRestante("Subasta cerrada");
      clearInterval(timerRef.current);
      await cargarGanadorYPago();
    });
  };

  /* ── Pujar ── */
  const handlePujar = async () => {
    setError("");
    const montoNum = Number(monto);
    if (!monto || isNaN(montoNum) || montoNum <= 0) {
      setError("Ingrese un monto válido.");
      return;
    }
    setEnviando(true);
    try {
      const res = await fetch(`${API_URL}/puja`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_subasta: Number(id),
          id_usuario: ID_USUARIO_COMPRADOR,
          nombre_usuario: nombreRef.current, 
          monto: montoNum,
        }),
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.message || "Error al registrar la puja");
      } else {
        setMonto("");
      }
    } catch (e) {
      setError("Error de conexión con el servidor");
    } finally {
      setEnviando(false);
    }
  };

  /* ── Confirmar pago ── */
  const handleConfirmarPago = async () => {
    if (!pago) return;
    setConfirmando(true);
    try {
      const res = await fetch(`${API_URL}/pago`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...pago,
          id_estado_pago: 2, // confirmado
        }),
      });
      await res.json();
      setPago((prev) => ({
        ...prev,
        id_estado_pago: 2,
        estado_pago: "confirmado",
      }));
    } catch (e) {
      console.error(e);
    } finally {
      setConfirmando(false);
    }
  };

  /* ── Render ── */
  if (loading)
    return (
      <div className="p-6 text-[#845b34] font-[Montserrat]">
        Cargando subasta...
      </div>
    );
  if (!subasta)
    return (
      <div className="p-6 text-red-600 font-[Montserrat]">
        Subasta no encontrada
      </div>
    );

  const imgUrl = subasta.imagen ? `${API_URL}/uploads/${subasta.imagen}` : null;
  const minimoRequerido = pujaMasAlta + Number(subasta.incremento_minimo || 0);
  const esGanador = ganador && ganador.id_usuario === ID_USUARIO_COMPRADOR;

  return (
    <div className="bg-gray-100 min-h-screen font-[Montserrat]">
      <div className="p-6 max-w-5xl mx-auto">
        {/* Botón volver */}
        <button
          onClick={() => navigate(-1)}
          className="mb-4 px-4 py-2 rounded text-sm font-semibold"
          style={{ backgroundColor: "#845b34", color: "#e8a96e" }}
        >
          ← Volver
        </button>

        {/*  Notificación puja superada  */}
        {notificacion && (
          <div className="mb-4 px-4 py-3 rounded font-semibold text-white bg-red-500 text-sm">
            {notificacion}
          </div>
        )}

        {/*  Anuncio cierre/ganador  */}
        {subastaCerrada && (
          <div
            className="mb-4 px-4 py-4 rounded text-center"
            style={{ backgroundColor: "#fdf3e7", border: "2px solid #845b34" }}
          >
            <p
              className="text-xl font-bold"
              style={{ fontFamily: "Georgia", color: "#845b34" }}
            >
              Subasta Finalizada
            </p>
            {ganador ? (
              <p className="mt-1 text-sm text-[#5b3717]">
                🏆 <strong>Ganador:</strong> {ganador.nombre_ganador} —{" "}
                <strong>Monto final:</strong> $
                {Number(ganador.monto_final).toLocaleString()}
              </p>
            ) : (
              <p className="mt-1 text-sm text-gray-500">
                Esta subasta finalizó sin ofertas.
              </p>
            )}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          {/* ── Información del Objeto ── */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2
              className="text-xl font-bold mb-3 text-[#845b34]"
              style={{ fontFamily: "Georgia" }}
            >
              Información del Objeto
            </h2>

            {imgUrl && (
              <div
                className="h-56 flex items-center justify-center mb-4 overflow-hidden rounded border"
                style={{ borderColor: "#e8a96e" }}
              >
                <img
                  src={imgUrl}
                  alt={subasta.modelo}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            )}

            <div className="space-y-2 text-sm text-[#5b3717]">
              <p>
                <strong>Nombre del objeto:</strong> {subasta.modelo}
              </p>
              <p>
                <strong>Descripción:</strong> {subasta.descripcion}
              </p>
              <p>
                <strong>Marca:</strong> {subasta.marca}
              </p>
              <p>
                <strong>Condición:</strong> {subasta.condicion}
              </p>
              <p>
                <strong>Vendedor:</strong>{" "}
                {subasta.nombre_vendedor
                  ? `${subasta.nombre_vendedor} ${subasta.apellido_vendedor}`
                  : "Sin vendedor"}
              </p>
            </div>

            {subasta.categorias && (
              <div className="flex gap-2 flex-wrap mt-3">
                {subasta.categorias.split(", ").map((cat, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: "#fdf3e7",
                      border: "1px solid #e8a96e",
                      color: "#845b34",
                    }}
                  >
                    {cat}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* ── Datos de la Subasta ── */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3
              className="text-xl font-bold mb-3 text-[#845b34]"
              style={{ fontFamily: "Georgia" }}
            >
              Datos de la Subasta
            </h3>

            {/* Contador */}
            <div
              className="text-center py-3 rounded mb-4 font-bold text-lg"
              style={{
                backgroundColor: subastaCerrada ? "#fee2e2" : "#fdf3e7",
                color: subastaCerrada ? "#dc2626" : "#845b34",
                border: `1px solid ${subastaCerrada ? "#dc2626" : "#e8a96e"}`,
              }}
            >
              ⏱ Tiempo restante: {tiempoRestante}
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm text-[#5b3717] mb-4">
              <div>
                <p className="text-xs text-gray-400 uppercase">Precio Base</p>
                <p className="font-semibold">
                  ${Number(subasta.precio_inicial).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase">
                  Incremento Mínimo
                </p>
                <p className="font-semibold">
                  ${Number(subasta.incremento_minimo).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase">
                  Puja Más Alta Actual
                </p>
                <p className="font-semibold text-green-700 text-base">
                  ${Number(pujaMasAlta).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase">Usuario Líder</p>
                <p className="font-semibold">
                  {usuarioLider || "Sin pujas aún"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase">
                  Total de Pujas
                </p>
                <p className="font-semibold">{pujas.length}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase">Estado</p>
                <span
                  className="px-2 py-1 rounded-full text-xs font-semibold"
                  style={{
                    backgroundColor: subastaCerrada ? "#fee2e2" : "#dcfce7",
                    color: subastaCerrada ? "#dc2626" : "#16a34a",
                  }}
                >
                  {subastaCerrada ? "Cerrada" : subasta.estado}
                </span>
              </div>
            </div>

            {/* Formulario de puja */}
            {!subastaCerrada && (
              <div
                className="mt-2 pt-4"
                style={{ borderTop: "1px solid #e8a96e" }}
              >
                <p
                  className="text-sm font-semibold mb-1"
                  style={{ color: "#845b34" }}
                >
                  Realizar Puja
                </p>
                <p className="text-xs text-gray-500 mb-2">
                  Monto mínimo requerido:{" "}
                  <strong>${minimoRequerido.toLocaleString()}</strong>
                </p>
                <p className="text-xs mb-2" style={{ color: "#845b34" }}>
                  Pujando como: <strong>{nombreComprador}</strong>
                </p>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={monto}
                    onChange={(e) => {
                      setMonto(e.target.value);
                      setError("");
                    }}
                    placeholder={`Ej: ${minimoRequerido}`}
                    min={minimoRequerido}
                    step="0.01"
                    className="flex-1 border rounded px-3 py-2 text-sm focus:outline-none text-black"
                    style={{ borderColor: error ? "#dc2626" : "#845b34" }}
                  />
                  <button
                    onClick={handlePujar}
                    disabled={enviando}
                    className="px-4 py-2 rounded text-sm font-semibold disabled:opacity-50"
                    style={{ backgroundColor: "#845b34", color: "#e8a96e" }}
                  >
                    {enviando ? "Enviando..." : "Pujar"}
                  </button>
                </div>
                {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
              </div>
            )}
          </div>
        </div>

        {/* ── Historial de Pujas ── */}
        <div className="mt-6 bg-white rounded-lg shadow p-6">
          <h3
            className="text-xl font-bold mb-4 text-[#845b34]"
            style={{ fontFamily: "Georgia" }}
          >
            Historial de Pujas
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: "#845b34" }}>
                  <th className="p-3 text-left text-[#e8a96e]">Usuario</th>
                  <th className="p-3 text-left text-[#e8a96e]">
                    Monto Ofertado
                  </th>
                  <th className="p-3 text-left text-[#e8a96e]">Fecha y Hora</th>
                </tr>
              </thead>
              <tbody className="text-[#5b3717]">
                {pujas.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="py-4 text-center text-gray-400">
                      No hay pujas registradas aún
                    </td>
                  </tr>
                ) : (
                  pujas.map((p, i) => (
                    <tr key={i} className="border-b border-gray-100">
                      <td className="p-3">{p.usuario}</td>
                      <td className="p-3 font-semibold text-green-700">
                        ${Number(p.monto).toLocaleString()}
                      </td>
                      <td className="p-3 text-gray-500">{p.fecha_hora}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Proceso de Pago ── */}
        {subastaCerrada && ganador && pago && (
          <div className="mt-6 bg-white rounded-lg shadow p-6">
            <h3
              className="text-xl font-bold mb-4 text-[#845b34]"
              style={{ fontFamily: "Georgia" }}
            >
              Proceso de Pago
            </h3>

            <div className="grid grid-cols-2 gap-4 text-sm text-[#5b3717] mb-4">
              <div>
                <p className="text-xs text-gray-400 uppercase">Ganador</p>
                <p className="font-semibold">{ganador.nombre_ganador}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase">Monto a Pagar</p>
                <p className="font-semibold text-green-700">
                  ${Number(pago.monto).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase">Fecha de Pago</p>
                <p className="font-semibold">
                  {pago.fecha_pago || "Pendiente"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase">
                  Método de Pago
                </p>
                <p className="font-semibold">{pago.metodo_pago || "-"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase">
                  Estado del Pago
                </p>
                <span
                  className="px-2 py-1 rounded-full text-xs font-semibold"
                  style={{
                    backgroundColor:
                      pago.id_estado_pago === 2 ? "#dcfce7" : "#fef9c3",
                    color: pago.id_estado_pago === 2 ? "#16a34a" : "#ca8a04",
                  }}
                >
                  {pago.id_estado_pago === 2 ? "Confirmado" : "Pendiente"}
                </span>
              </div>
            </div>

            {/* Botón confirmar pago — solo si está pendiente y el usuario es el ganador */}
            {pago.id_estado_pago !== 2 && esGanador && (
              <button
                onClick={handleConfirmarPago}
                disabled={confirmando}
                className="px-4 py-2 rounded text-sm font-semibold disabled:opacity-50"
                style={{ backgroundColor: "#845b34", color: "#e8a96e" }}
              >
                {confirmando ? "Confirmando..." : "Confirmar Pago"}
              </button>
            )}

            {pago.id_estado_pago === 2 && (
              <p className="text-green-700 text-sm font-semibold mt-2">
                ✓ Pago confirmado correctamente
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
