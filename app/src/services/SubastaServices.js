const API_URL = import.meta.env.VITE_API_URL;

/* Obtener todas las subastas */
export async function getSubastas() {
    const response = await fetch(`${API_URL}/subasta`);

    if (!response.ok) {
        throw new Error("Error al obtener subastas");
    }

    return await response.json();
}

/* Obtener subastas activas */
export async function getSubastasActivas() {
    const response = await fetch(`${API_URL}/subasta/activas`);

    if (!response.ok) {
        throw new Error("Error al obtener subastas activas");
    }

    return await response.json();
}

/* Obtener subastas finalizadas */
export async function getSubastasFinalizadas() {
    const response = await fetch(`${API_URL}/subasta/finalizadas`);

    if (!response.ok) {
        throw new Error("Error al obtener subastas finalizadas");
    }

    return await response.json();
}

/* Obtener detalle de una subasta */
export async function getSubastaDetalle(idSubasta) {
    const response = await fetch(`${API_URL}/subasta/${idSubasta}`);

    if (!response.ok) {
        throw new Error("Error al obtener la subasta");
    }

    return await response.json();
}

/* Crear subasta */
export async function createSubasta(data) {
    const response = await fetch(`${API_URL}/subasta`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error("Error al crear subasta");
    }

    return await response.json();
}

/* Actualizar subasta */
export async function updateSubasta(data) {
    const response = await fetch(`${API_URL}/subasta`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error("Error al actualizar subasta");
    }

    return await response.json();
}

/* Eliminar subasta */
export async function deleteSubasta(idSubasta) {
    const response = await fetch(`${API_URL}/subasta/${idSubasta}`, {
        method: "DELETE"
    });

    if (!response.ok) {
        throw new Error("Error al eliminar subasta");
    }

    return await response.json();


}

export async function getHistorialPujas(idSubasta) {
    const response = await fetch(`${API_URL}/puja/getBySubasta/${idSubasta}`);

    if (!response.ok) {
        throw new Error("Error al obtener historial de pujas");
    }

    return await response.json();
}

