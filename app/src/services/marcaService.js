import { apiFetch } from "./api";

export function getMarcas() {
  return apiFetch("marca");
}