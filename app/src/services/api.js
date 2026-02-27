const API_BASE =
  import.meta.env.VITE_API_URL || "http://localhost/appsubasta/api";

export async function apiFetch(endpoint) {
  const response = await fetch(`${API_BASE}/${endpoint}`);

  if (!response.ok) {
    throw new Error("Error en la petición");
  }

  const json = await response.json();
  return json.data;
}