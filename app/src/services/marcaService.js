const API_BASE =
    import.meta.env.VITE_API_URL || "http://localhost/PROYECTO_AMBIENTEWEB1/api";

export async function getMarcas() {
    // AJUSTA ESTA RUTA SEGÚN TU ROUTER:
    const res = await fetch(`${API_BASE}/marca`);
    if (!res.ok) throw new Error("No se pudieron cargar las marcas");
    return await res.json();
}