import { apiFetch } from "./api";

/* USUARIO */
export function getUsuario(id) {
  return apiFetch(`usuario/${id}`);
}

/* LISTAR TODOS */
export function getRelojes() {
  return apiFetch("reloj");
}

/* DETALLE */
export function getRelojDetalle(id) {
  return apiFetch(`reloj/${id}`);
}


export function crearReloj(formData) {
  return fetch("http://localhost:81/appsubasta/api/reloj", {
    method: "POST",
    body: formData, 
  }).then((res) => res.json());
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

/* ACTIVAR/DESACTIVAR */
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