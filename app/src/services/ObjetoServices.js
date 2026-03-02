import { apiFetch } from "./api";

export function getRelojes() {
  return apiFetch("reloj");
}

export function getRelojDetalle(id) {
  return apiFetch(`reloj/${id}`);
}