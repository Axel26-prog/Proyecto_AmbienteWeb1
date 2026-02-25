import { apiFetch } from "./api";

export function getUsuarios() {
  return apiFetch("usuario"); 
}