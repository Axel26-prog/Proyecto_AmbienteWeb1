//obtiene el id del usuario actual desde la URL
export function getUsuarioActualId() {
    const params = new URLSearchParams(window.location.search); //lee el parametro que viene en la URL, que es el id del usuario
    const usuarioUrl = params.get("usuario");

    //si viene en la URL, usar ese
    if (usuarioUrl && !isNaN(Number(usuarioUrl))) {
        return Number(usuarioUrl);
    }

    //si NO viene en la URL, siempre usar el usuario 1 por defecto, que es el Admin
    return 1;
}

//limpia el usuario 
export function limpiarUsuarioActual() {
    localStorage.removeItem("usuarioActualId");
}

//contruye una ruta manteniendo el usuario actual en la URL
export function armarRutaConUsuario(rutaBase) {
    const idUsuario = getUsuarioActualId(); //obtener el id actual
    return `${rutaBase}?usuario=${idUsuario}`;//retorna la ruta con el id del usuario
}