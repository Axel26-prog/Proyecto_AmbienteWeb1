import { apiFetch } from "./api";

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