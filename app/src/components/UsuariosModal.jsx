import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { createUsuario, updateUsuario } from "@/services/UsuarioServices";

export default function UsuarioModal({
    isOpen,
    onClose,
    modo = "crear",
    usuario = null,
    onGuardar,
}) {
    const [formData, setFormData] = useState({
        id_usuario: "",
        nombre: "",
        apellido: "",
        correo: "",
        contrasena: "",
        telefono: "",
        id_rol: "",
        id_estado_usuario: "",
    });

    const [errores, setErrores] = useState({});
    const [saving, setSaving] = useState(false);

    const obtenerIdRol = (rol) => {
        switch (rol) {
            case "Administrador":
                return "1";
            case "Vendedor":
                return "2";
            case "Cliente":
                return "3";
            default:
                return "";
        }
    };

    const obtenerIdEstado = (estado) => {
        switch (estado) {
            case "Activo":
                return "1";
            case "Inactivo":
                return "2";
            case "Suspendido":
                return "3";
            default:
                return "";
        }
    };

    useEffect(() => {
        if (modo === "editar" && usuario) {
            setFormData({
                id_usuario: usuario.id_usuario || "",
                nombre: usuario.nombre || "",
                apellido: usuario.apellido || "",
                correo: usuario.correo || "",
                contrasena: "",
                telefono: usuario.telefono || "",
                id_rol: usuario.id_rol?.toString() || obtenerIdRol(usuario.rol),
                id_estado_usuario:
                    usuario.id_estado_usuario?.toString() || obtenerIdEstado(usuario.estado),
            });
        } else if (modo === "crear") {
            setFormData({
                id_usuario: "",
                nombre: "",
                apellido: "",
                correo: "",
                contrasena: "",
                telefono: "",
                id_rol: "",
                id_estado_usuario: "",
            });
        }

        setErrores({});
    }, [modo, usuario, isOpen]);

    const validarFormulario = () => {
        const nuevosErrores = {};

        const nombreRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
        const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const telefonoRegex = /^[0-9]{8}$/;

        if (!formData.nombre.trim()) {
            nuevosErrores.nombre = "El nombre es obligatorio";
        } else if (!nombreRegex.test(formData.nombre.trim())) {
            nuevosErrores.nombre = "El nombre solo debe contener letras";
        }

        if (!formData.apellido.trim()) {
            nuevosErrores.apellido = "El apellido es obligatorio";
        } else if (!nombreRegex.test(formData.apellido.trim())) {
            nuevosErrores.apellido = "El apellido solo debe contener letras";
        }

        if (!formData.correo.trim()) {
            nuevosErrores.correo = "El correo es obligatorio";
        } else if (!correoRegex.test(formData.correo.trim())) {
            nuevosErrores.correo = "Ingrese un correo válido";
        }

        if (modo === "crear") {
            if (!formData.contrasena.trim()) {
                nuevosErrores.contrasena = "La contraseña es obligatoria";
            } else if (formData.contrasena.length < 6) {
                nuevosErrores.contrasena = "La contraseña debe tener al menos 6 caracteres";
            }

            if (!formData.telefono.trim()) {
                nuevosErrores.telefono = "El teléfono es obligatorio";
            } else if (!telefonoRegex.test(formData.telefono.trim())) {
                nuevosErrores.telefono = "El teléfono debe tener 8 dígitos";
            }

            if (!formData.id_rol) {
                nuevosErrores.id_rol = "Debe seleccionar un rol";
            }

            if (!formData.id_estado_usuario) {
                nuevosErrores.id_estado_usuario = "Debe seleccionar un estado";
            }
        }

        setErrores(nuevosErrores);
        return Object.keys(nuevosErrores).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        let nuevoValor = value;

        if (name === "telefono") {
            nuevoValor = value.replace(/\D/g, "").slice(0, 8);
        }

        if (name === "nombre" || name === "apellido") {
            nuevoValor = value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ\s]/g, "");
        }

        setFormData((prev) => ({
            ...prev,
            [name]: nuevoValor,
        }));

        setErrores((prev) => ({
            ...prev,
            [name]: "",
        }));
    };

    const handleCerrar = async () => {
        const hayCambios = Object.values(formData).some((valor) => valor !== "");

        if (!hayCambios || modo === "editar") {
            onClose();
            return;
        }

        const result = await Swal.fire({
            title: "¿Desea cerrar el formulario?",
            text: "Se perderán los datos ingresados.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, cerrar",
            cancelButtonText: "Cancelar",
            confirmButtonColor: "#845b34",
            cancelButtonColor: "#6b7280",
            background: "#fff",
            color: "#5b3717",
            showClass: {
                popup: "animate__animated animate__fadeInDown",
            },
            hideClass: {
                popup: "animate__animated animate__fadeOutUp",
            },
        });

        if (result.isConfirmed) {
            onClose();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validarFormulario()) {
            Swal.fire({
                title: "Formulario incompleto",
                text: "Revise los campos marcados en rojo.",
                icon: "warning",
                confirmButtonColor: "#845b34",
                background: "#fff",
                color: "#5b3717",
                showClass: {
                    popup: "animate__animated animate__shakeX",
                },
                hideClass: {
                    popup: "animate__animated animate__fadeOut",
                },
            });
            return;
        }

        try {
            setSaving(true);
            let respuesta;

            if (modo === "editar") {
                respuesta = await updateUsuario(formData.id_usuario, {
                    id_usuario: formData.id_usuario,
                    nombre: formData.nombre.trim(),
                    apellido: formData.apellido.trim(),
                    correo: formData.correo.trim(),
                });
            } else {
                respuesta = await createUsuario({
                    ...formData,
                    nombre: formData.nombre.trim(),
                    apellido: formData.apellido.trim(),
                    correo: formData.correo.trim(),
                    telefono: formData.telefono.trim(),
                });
            }

            console.log("Respuesta API:", respuesta);

            await Swal.fire({
                title: "Éxito",
                text:
                    modo === "editar"
                        ? "Usuario actualizado correctamente"
                        : "Usuario creado correctamente",
                icon: "success",
                confirmButtonText: "Aceptar",
                confirmButtonColor: "#845b34",
                background: "#fff",
                color: "#5b3717",
                showClass: {
                    popup: "animate__animated animate__zoomIn",
                },
                hideClass: {
                    popup: "animate__animated animate__zoomOut",
                },
            });

            if (onGuardar) {
                await onGuardar();
            }

            onClose();
        } catch (error) {
            console.error("Error guardando usuario:", error);

            Swal.fire({
                title: "Error",
                text: error?.message || "No se pudo guardar el usuario",
                icon: "error",
                confirmButtonColor: "#845b34",
                background: "#fff",
                color: "#5b3717",
                showClass: {
                    popup: "animate__animated animate__shakeX",
                },
                hideClass: {
                    popup: "animate__animated animate__fadeOut",
                },
            });
        } finally {
            setSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="w-full max-w-2xl rounded-2xl border border-[#845b34]/30 bg-white shadow-2xl">
                <div className="flex items-center justify-between rounded-t-2xl border-b border-[#845b34]/20 bg-[#845b34] px-6 py-4">
                    <h2
                        className="text-2xl font-bold text-[#e8a96e]"
                        style={{ fontFamily: "Georgia" }}
                    >
                        {modo === "editar" ? "Editar Usuario" : "Agregar Usuario"}
                    </h2>

                    <button
                        type="button"
                        onClick={handleCerrar}
                        className="rounded-md px-3 py-1 text-lg font-bold text-[#e8a96e] transition hover:bg-[#5b3717]"
                        style={{ fontFamily: "Montserrat" }}
                    >
                        ✕
                    </button>
                </div>

                <div className="px-6 py-6">
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <label
                                className="mb-1 block font-bold text-[#845b34]"
                                style={{ fontFamily: "Georgia" }}
                            >
                                Nombre
                            </label>
                            <input
                                type="text"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                                placeholder="Ingrese el nombre"
                                className={`w-full rounded-lg border px-4 py-3 text-[#5b3717] outline-none transition ${errores.nombre
                                    ? "border-red-500 focus:ring-2 focus:ring-red-300"
                                    : "border-[#845b34]/30 focus:border-[#845b34] focus:ring-2 focus:ring-[#e8a96e]/40"
                                    }`}
                                style={{ fontFamily: "Montserrat" }}
                            />
                            {errores.nombre && (
                                <p className="mt-1 text-sm text-red-600">{errores.nombre}</p>
                            )}
                        </div>

                        <div>
                            <label
                                className="mb-1 block font-bold text-[#845b34]"
                                style={{ fontFamily: "Georgia" }}
                            >
                                Apellido
                            </label>
                            <input
                                type="text"
                                name="apellido"
                                value={formData.apellido}
                                onChange={handleChange}
                                placeholder="Ingrese el apellido"
                                className={`w-full rounded-lg border px-4 py-3 text-[#5b3717] outline-none transition ${errores.apellido
                                    ? "border-red-500 focus:ring-2 focus:ring-red-300"
                                    : "border-[#845b34]/30 focus:border-[#845b34] focus:ring-2 focus:ring-[#e8a96e]/40"
                                    }`}
                                style={{ fontFamily: "Montserrat" }}
                            />
                            {errores.apellido && (
                                <p className="mt-1 text-sm text-red-600">{errores.apellido}</p>
                            )}
                        </div>

                        <div>
                            <label
                                className="mb-1 block font-bold text-[#845b34]"
                                style={{ fontFamily: "Georgia" }}
                            >
                                Correo
                            </label>
                            <input
                                type="email"
                                name="correo"
                                value={formData.correo}
                                onChange={handleChange}
                                placeholder="Ingrese el correo"
                                className={`w-full rounded-lg border px-4 py-3 text-[#5b3717] outline-none transition ${errores.correo
                                    ? "border-red-500 focus:ring-2 focus:ring-red-300"
                                    : "border-[#845b34]/30 focus:border-[#845b34] focus:ring-2 focus:ring-[#e8a96e]/40"
                                    }`}
                                style={{ fontFamily: "Montserrat" }}
                            />
                            {errores.correo && (
                                <p className="mt-1 text-sm text-red-600">{errores.correo}</p>
                            )}
                        </div>

                        <div>
                            <label
                                className="mb-1 block font-bold text-[#845b34]"
                                style={{ fontFamily: "Georgia" }}
                            >
                                Contraseña
                            </label>
                            <input
                                type="password"
                                name="contrasena"
                                value={modo === "editar" ? "********" : formData.contrasena}
                                onChange={handleChange}
                                placeholder={modo === "editar" ? "" : "Ingrese la contraseña"}
                                readOnly={modo === "editar"}
                                className={`w-full rounded-lg border px-4 py-3 text-[#5b3717] outline-none transition ${modo === "editar"
                                        ? "border-[#845b34]/20 bg-gray-100 cursor-not-allowed"
                                        : "border-[#845b34]/30 focus:border-[#845b34] focus:ring-2 focus:ring-[#e8a96e]/40"
                                    }`}
                                style={{ fontFamily: "Montserrat" }}
                            />
                            {errores.contrasena && (
                                <p className="mt-1 text-sm text-red-600">{errores.contrasena}</p>
                            )}
                        </div>

                        <div>
                            <label
                                className="mb-1 block font-bold text-[#845b34]"
                                style={{ fontFamily: "Georgia" }}
                            >
                                Teléfono
                            </label>
                            <input
                                type="text"
                                name="telefono"
                                value={formData.telefono}
                                onChange={handleChange}
                                placeholder="Ingrese el teléfono"
                                readOnly={modo === "editar"}
                                className={`w-full rounded-lg border px-4 py-3 text-[#5b3717] outline-none transition ${modo === "editar"
                                    ? "cursor-not-allowed border-[#845b34]/20 bg-gray-100"
                                    : errores.telefono
                                        ? "border-red-500 focus:ring-2 focus:ring-red-300"
                                        : "border-[#845b34]/30 focus:border-[#845b34] focus:ring-2 focus:ring-[#e8a96e]/40"
                                    }`}
                                style={{ fontFamily: "Montserrat" }}
                            />
                            {errores.telefono && (
                                <p className="mt-1 text-sm text-red-600">{errores.telefono}</p>
                            )}
                        </div>

                        <div>
                            <label
                                className="mb-1 block font-bold text-[#845b34]"
                                style={{ fontFamily: "Georgia" }}
                            >
                                Rol
                            </label>
                            <select
                                name="id_rol"
                                value={formData.id_rol}
                                onChange={handleChange}
                                disabled={modo === "editar"}
                                className={`w-full rounded-lg border px-4 py-3 text-[#5b3717] outline-none transition ${modo === "editar"
                                    ? "cursor-not-allowed border-[#845b34]/20 bg-gray-100"
                                    : errores.id_rol
                                        ? "border-red-500 focus:ring-2 focus:ring-red-300"
                                        : "border-[#845b34]/30 bg-white focus:border-[#845b34] focus:ring-2 focus:ring-[#e8a96e]/40"
                                    }`}
                                style={{ fontFamily: "Montserrat" }}
                            >
                                <option value="" disabled>
                                    Seleccione un rol
                                </option>
                                <option value="1">Administrador</option>
                                <option value="2">Vendedor</option>
                                <option value="3">Cliente</option>
                            </select>
                            {errores.id_rol && (
                                <p className="mt-1 text-sm text-red-600">{errores.id_rol}</p>
                            )}
                        </div>

                        <div className="md:col-span-2">
                            <label
                                className="mb-1 block font-bold text-[#845b34]"
                                style={{ fontFamily: "Georgia" }}
                            >
                                Estado
                            </label>
                            <select
                                name="id_estado_usuario"
                                value={formData.id_estado_usuario}
                                onChange={handleChange}
                                disabled={modo === "editar"}
                                className={`w-full rounded-lg border px-4 py-3 text-[#5b3717] outline-none transition ${modo === "editar"
                                    ? "cursor-not-allowed border-[#845b34]/20 bg-gray-100"
                                    : errores.id_estado_usuario
                                        ? "border-red-500 focus:ring-2 focus:ring-red-300"
                                        : "border-[#845b34]/30 bg-white focus:border-[#845b34] focus:ring-2 focus:ring-[#e8a96e]/40"
                                    }`}
                                style={{ fontFamily: "Montserrat" }}
                            >
                                <option value="" disabled>
                                    Seleccione un estado
                                </option>
                                <option value="1">Activo</option>
                                <option value="2">Inactivo</option>
                                <option value="3">Suspendido</option>
                            </select>
                            {errores.id_estado_usuario && (
                                <p className="mt-1 text-sm text-red-600">{errores.id_estado_usuario}</p>
                            )}
                        </div>

                        <div className="mt-2 flex justify-end gap-3 rounded-b-2xl border-t border-[#845b34]/20 bg-[#f8f5f2] px-0 py-4 md:col-span-2">
                            <button
                                type="button"
                                onClick={handleCerrar}
                                className="rounded-lg border border-[#845b34] px-5 py-2 font-semibold text-[#845b34] transition hover:bg-[#845b34]/10"
                                style={{ fontFamily: "Montserrat" }}
                            >
                                Cancelar
                            </button>

                            <button
                                type="submit"
                                disabled={saving}
                                className={`rounded-lg px-5 py-2 font-semibold text-[#e8a96e] transition ${saving
                                    ? "cursor-not-allowed bg-[#845b34]/60"
                                    : "bg-[#845b34] hover:bg-[#5b3717]"
                                    }`}
                                style={{ fontFamily: "Montserrat" }}
                            >
                                {saving
                                    ? "Guardando..."
                                    : modo === "editar"
                                        ? "Guardar Cambios"
                                        : "Guardar"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}