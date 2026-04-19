export function getUsuarioActualId() {
    const params = new URLSearchParams(window.location.search);
    const usuarioUrl = params.get("usuario");

    // Si viene en la URL, usar ese
    if (usuarioUrl && !isNaN(Number(usuarioUrl))) {
        return Number(usuarioUrl);
    }

    // Si NO viene en la URL, siempre usar el usuario 1 por defecto
    return 1;
}

export function limpiarUsuarioActual() {
    localStorage.removeItem("usuarioActualId");
}

export function armarRutaConUsuario(rutaBase) {
    const idUsuario = getUsuarioActualId();
    return `${rutaBase}?usuario=${idUsuario}`;
}