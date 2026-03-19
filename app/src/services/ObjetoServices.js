import { apiFetch } from "./api";

/* LISTAR TODOS */

export function getRelojes() {
  return apiFetch("reloj");
}

/* DETALLE */

export function getRelojDetalle(id) {
  return apiFetch(`reloj/${id}`);
}

/* CREAR */

export function crearReloj(data) {
  return apiFetch("reloj", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

/* EDITAR */

export function actualizarReloj(data) {
  return fetch("http://localhost:81/appsubasta/api/reloj/update", {
    method: "POST",
    body: data, 
  }).then((res) => res.json());
}

/* ELIMINACIÓN LÓGICA */

export function eliminarReloj(id) {
  return apiFetch(`reloj/${id}`, {
    method: "DELETE",
  });
}

/* ACTIVAR */

 export function cambiarActivo(id) {
  return apiFetch(`reloj/toggle/${id}`, {
    method: "PUT",
  });
}
export function getMarcas() {
  return apiFetch("marca");
}

export function getCondiciones() {
  return apiFetch("condicion");
}

export function getCategorias() {
  return apiFetch("categoria");
}