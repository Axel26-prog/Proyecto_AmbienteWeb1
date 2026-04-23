export function getUsuarioActualId() {
    const params = new URLSearchParams(window.location.search);
    const usuarioUrl = params.get("usuario");

    if (usuarioUrl && !isNaN(Number(usuarioUrl))) {
        localStorage.setItem("usuarioActualId", usuarioUrl);
        return Number(usuarioUrl);
    }

    const usuarioGuardado = localStorage.getItem("usuarioActualId");
    return usuarioGuardado ? Number(usuarioGuardado) : null;
}

export function limpiarUsuarioActual() {
    localStorage.removeItem("usuarioActualId");
}

export function armarRutaConUsuario(rutaBase) {
    const idUsuario = getUsuarioActualId();
    return idUsuario ? `${rutaBase}?usuario=${idUsuario}` : rutaBase;
}