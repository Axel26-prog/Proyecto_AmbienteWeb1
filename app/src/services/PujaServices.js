const API_URL = import.meta.env.VITE_API_URL;

/* Obtener todas las pujas */
export async function getPujas() {
    const response = await fetch(`${API_URL}/puja`);

    if (!response.ok) {
        throw new Error("Error al obtener pujas");
    }

    return await response.json();
}

/* Obtener una puja por ID */
export async function getPuja(idPuja) {
    const response = await fetch(`${API_URL}/puja/${idPuja}`);

    if (!response.ok) {
        throw new Error("Error al obtener la puja");
    }

    return await response.json();
}

/* Obtener pujas de una subasta */
export async function getPujasBySubasta(idSubasta) {
    const response = await fetch(`${API_URL}/puja/subasta/${idSubasta}`);

    if (!response.ok) {
        throw new Error("Error al obtener pujas de la subasta");
    }

    return await response.json();
}

/* Obtener la puja más alta de una subasta */
export async function getPujaMasAlta(idSubasta) {
    const response = await fetch(`${API_URL}/puja/maxima/${idSubasta}`);

    if (!response.ok) {
        throw new Error("Error al obtener la puja más alta");
    }

    return await response.json();
}

/* Crear una nueva puja */
export async function createPuja(data) {
    const response = await fetch(`${API_URL}/puja`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error("Error al crear la puja");
    }

    return await response.json();
}

/* Obtener pujas de un usuario */
export async function getPujasByUsuario(idUsuario) {
    const response = await fetch(`${API_URL}/puja/usuario/${idUsuario}`);

    if (!response.ok) {
        throw new Error("Error al obtener pujas del usuario");
    }

    return await response.json();
}

/* Eliminar una puja */
export async function deletePuja(idPuja) {
    const response = await fetch(`${API_URL}/puja/${idPuja}`, {
        method: "DELETE"
    });

    if (!response.ok) {
        throw new Error("Error al eliminar la puja");
    }

    return await response.json();
}