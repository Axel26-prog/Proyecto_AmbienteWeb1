const API_BASE =
  import.meta.env.VITE_API_URL || "http://localhost:81/appsubasta/api";

export async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE}/${endpoint}`, {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    body: options.body || null,
  });

  const json = await response.json();

  if (!response.ok) {
    console.error("Respuesta API con error:", json);
    throw new Error(json.message || `Error en la petición: ${response.status}`);
  }

  return json.data ?? json;
}