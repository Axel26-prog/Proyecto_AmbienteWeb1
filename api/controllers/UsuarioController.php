<?php

use Firebase\JWT\JWT;

class UsuarioController
{
    // ─── Listar todos ────────────────────────────────────────────────────────
    public function index()
    {
        try {
            $auth = new AuthMiddleware();
            $auth->handle(["Administrador"]);

            $response = new Response();
            $model    = new UsuarioModel();
            $result   = $model->all();
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    // ─── Obtener uno ─────────────────────────────────────────────────────────
    public function get($id)
    {
        try {
            $auth = new AuthMiddleware();
            $auth->handle(["Administrador", "Vendedor", "Comprador"]);

            $response = new Response();
            $model    = new UsuarioModel();
            $result   = $model->get($id);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    // ─── Detalle enriquecido ─────────────────────────────────────────────────
    public function detalle($id)
    {
        try {
            $auth = new AuthMiddleware();
            $auth->handle(["Administrador", "Vendedor", "Comprador"]);

            $response = new Response();
            $model    = new UsuarioModel();
            $result   = $model->getDetalle($id);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    // ─── Registro público ────────────────────────────────────────────────────
    /**
     * POST /usuario/register
     * Body: { nombre, apellido, correo, contrasena, telefono, id_rol }
     * Los usuarios se registran como Comprador (id_rol=3) o Vendedor (id_rol=2)
     * El estado inicial es Activo (id_estado_usuario=1)
     */
    public function register()
    {
        try {
            $request = json_decode(file_get_contents("php://input"));

            // Validaciones básicas
            if (empty($request->nombre))    throw new Exception("El nombre es obligatorio");
            if (empty($request->apellido))  throw new Exception("El apellido es obligatorio");
            if (empty($request->correo))    throw new Exception("El correo es obligatorio");
            if (empty($request->contrasena)) throw new Exception("La contraseña es obligatoria");
            if (!filter_var($request->correo, FILTER_VALIDATE_EMAIL))
                throw new Exception("El correo no es válido");
            if (strlen($request->contrasena) < 6)
                throw new Exception("La contraseña debe tener al menos 6 caracteres");

            // Roles permitidos en registro público: Comprador(2) o Vendedor(3)
            $rolesPermitidos = [2, 3];
            $id_rol = isset($request->id_rol) ? intval($request->id_rol) : 2; // Comprador por defecto
            if (!in_array($id_rol, $rolesPermitidos))
                throw new Exception("Rol no permitido en el registro");

            $model = new UsuarioModel();

            // Verificar correo duplicado
            $existe = $model->getByCorreo($request->correo);
            if ($existe) throw new Exception("El correo ya está registrado");

            $request->id_rol            = $id_rol;
            $request->id_estado_usuario = 1; // Activo por defecto

            $nuevoId = $model->create($request);

            $response = new Response();
            $response->toJSON([
                "success" => true,
                "message" => "Usuario registrado correctamente",
                "id"      => $nuevoId
            ]);
        } catch (Exception $e) {
            http_response_code(400);
            echo json_encode([
                "success" => false,
                "message" => $e->getMessage()
            ]);
        }
    }

    // ─── Login con JWT ───────────────────────────────────────────────────────
    /**
     * POST /usuario/login
     * Body: { correo, contrasena }
     * Devuelve JWT con datos del usuario
     */
    public function login()
    {
        try {
            $request = json_decode(file_get_contents("php://input"));

            if (empty($request->correo) || empty($request->contrasena))
                throw new Exception("Correo y contraseña son obligatorios");

            $model   = new UsuarioModel();
            $usuario = $model->login($request->correo, $request->contrasena);

            if (!$usuario) {
                http_response_code(401);
                echo json_encode([
                    "success" => false,
                    "message" => "Credenciales inválidas"
                ]);
                return;
            }

            // Verificar que el usuario esté activo (estado 1 = Activo)
            // Estado 2 = Inactivo, Estado 3 = Suspendido
            if ($usuario->id_estado_usuario != 1) {
                $mensaje = $usuario->id_estado_usuario == 3
                    ? "Tu cuenta está suspendida. Contacta al administrador."
                    : "Tu cuenta está inactiva. Contacta al administrador.";
                http_response_code(403);
                echo json_encode([
                    "success" => false,
                    "message" => $mensaje
                ]);
                return;
            }

            // Generar JWT
            $payload = [
                "iat"  => time(),
                "exp"  => time() + (60 * 60 * 8), // 8 horas
                "sub"  => $usuario->id_usuario,
                "rol"  => (object)["name" => $usuario->rol],
                "data" => [
                    "id_usuario"       => $usuario->id_usuario,
                    "nombre"           => $usuario->nombre,
                    "apellido"         => $usuario->apellido,
                    "correo"           => $usuario->correo,
                    "rol"              => $usuario->rol,
                    "id_rol"           => $usuario->id_rol,
                    "estado"           => $usuario->estado,
                    "id_estado_usuario"=> $usuario->id_estado_usuario,
                ]
            ];

            $token = JWT::encode($payload, config::get('SECRET_KEY'), 'HS256');

            $response = new Response();
            $response->toJSON([
                "success" => true,
                "token"   => $token,
                "data"    => $payload["data"]
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                "success" => false,
                "message" => $e->getMessage()
            ]);
        }
    }

    // ─── Logout (stateless — el cliente elimina el token) ────────────────────
    public function logout()
    {
        $response = new Response();
        $response->toJSON([
            "success" => true,
            "message" => "Sesión cerrada"
        ]);
    }

    // ─── Crear (solo administrador) ──────────────────────────────────────────
    public function create()
    {
        try {
            $auth = new AuthMiddleware();
            $auth->handle(["Administrador"]);

            $request = json_decode(file_get_contents("php://input"));
            $model   = new UsuarioModel();
            $result  = $model->create($request);

            $response = new Response();
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    // ─── Actualizar perfil ───────────────────────────────────────────────────
    /**
     * El usuario solo puede editar su propio perfil.
     * El administrador puede editar cualquiera.
     */
    public function update($id = null)
    {
        try {
            $auth    = new AuthMiddleware();
            $decoded = $auth->handleAndReturn(["Administrador", "Vendedor", "Comprador"]);

            $request = json_decode(file_get_contents("php://input"));
            if ($id !== null) $request->id_usuario = $id;

            // Solo el propio usuario o el administrador puede editar
            $esAdmin   = $decoded->rol->name === "Administrador";
            $esPropio  = intval($decoded->sub) === intval($request->id_usuario);

            if (!$esAdmin && !$esPropio) {
                http_response_code(403);
                echo json_encode([
                    "success" => false,
                    "message" => "No tienes permiso para editar este perfil"
                ]);
                return;
            }

            $model  = new UsuarioModel();
            $result = $model->update($request);

            $response = new Response();
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    // ─── Activar / Bloquear (solo administrador) ────────────────────────────
    public function delete($id)
    {
        try {
            $auth = new AuthMiddleware();
            $auth->handle(["Administrador"]);

            $model  = new UsuarioModel();
            $result = $model->delete($id);

            $response = new Response();
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}