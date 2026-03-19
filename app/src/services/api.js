const API_BASE =
  import.meta.env.VITE_API_URL || "http://localhost:81/appsubasta/api";

export async function apiFetch(endpoint, options = {}) {
<<<<<<< HEAD
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
=======
  const response = await fetch(`${API_BASE}/${endpoint}`, {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
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
>>>>>>> Mant_Usuarios
}