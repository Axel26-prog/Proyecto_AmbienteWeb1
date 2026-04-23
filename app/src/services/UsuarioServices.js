import { apiFetch } from "./api";

// ─── Auth ────────────────────────────────────────────────────────────────────

export const loginUsuario = async ({ correo, contrasena }) => {
  return apiFetch("usuario/login", {
    method: "POST",
    body: JSON.stringify({ correo, contrasena }),
  });
};

export const registerUsuario = async (data) => {
  return apiFetch("usuario/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const logoutUsuario = async () => {
  return apiFetch("usuario/logout");
};

// ─── CRUD ────────────────────────────────────────────────────────────────────

export function getUsuarios() {
  return apiFetch("usuario");
}

export function getUsuarioDetalle(id) {
  return apiFetch(`usuario/detalle/${id}`);
}

export function createUsuario(data) {
  return apiFetch("usuario", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateUsuario(id, data) {
  return apiFetch(`usuario/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function deleteUsuario(id) {
  return apiFetch(`usuario/${id}`, {
    method: "DELETE",
  });
}