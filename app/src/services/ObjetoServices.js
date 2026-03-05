import { apiFetch } from "./api";

export function getRelojes() {
  return apiFetch("reloj");
}

export function getRelojDetalle(id) {
  return apiFetch(`reloj/${id}`);
}

export async function getRelojesPorMarca(idMarca) {
    let url = `${API_URL}/reloj`;

    if (idMarca) {
        url += `?marca=${idMarca}`;
    }

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Error al obtener relojes");
    }

    return await response.json();
}