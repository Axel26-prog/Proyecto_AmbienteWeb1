const API_BASE =
  import.meta.env.VITE_API_URL || "http://localhost:81/appsubasta/api";

export async function apiFetch(endpoint, options = {}) {
  const response = await fetch(`${API_BASE}/${endpoint}`, options);

  if (!response.ok) {
    throw new Error("Error en la petición");
  }

  let json = null;

  try {
    json = await response.json();
  } catch (error) {

    return null;
  }

  return json?.data ?? json;
}