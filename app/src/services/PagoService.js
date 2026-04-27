const API_URL = import.meta.env.VITE_API_URL;

export async function getPagosByUsuario(idUsuario) {
    const res = await fetch(`${API_URL}/pago/getByUsuario/${idUsuario}`);

    if (!res.ok) {
        throw new Error("No se pudieron cargar los pagos del usuario");
    }

    return await res.json();
}

export async function getPagosAdmin() {
    const res = await fetch(`${API_URL}/pago/getPagosAdmin`);

    if (!res.ok) {
        throw new Error("No se pudieron cargar los pagos del administrador");
    }

    return await res.json();
}


export async function confirmarPago(pago) {
    const res = await fetch(`${API_URL}/pago`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            ...pago,
            id_estado_pago: 2,
            fecha_pago: new Date().toISOString().slice(0, 19).replace("T", " "),
        }),
    });

    if (!res.ok) {
        throw new Error("No se pudo confirmar el pago");
    }

    return await res.json();
}