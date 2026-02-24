const API_BASE = import.meta.env.VITE_API_URL;

export async function getMarcas() {
    const res = await fetch(`${API_BASE}/marca`);
    if (!res.ok) throw new Error("No se pudieron cargar las marcas");
    return await res.json();
}