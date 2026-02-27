import { apiFetch } from "./api";

export function getUsuarios() {
  return apiFetch("usuario"); 
}

export function getUsuarioDetalle(id) {
  return apiFetch(`usuario/detalle/${id}`);
}