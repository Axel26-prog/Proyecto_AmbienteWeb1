<?php

use Firebase\JWT\ExpiredException;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class AuthMiddleware
{
    /**
     * Validar token y rol. Detiene ejecución si falla.
     * @param array $requiredRoles  Ej: ["Administrador","Comprador"]
     * @return bool
     */
    public function handle($requiredRoles)
    {
        $token = $this->getTokenFromHeader();
        if (!$token) return $this->errorResponse(401, 'Acceso denegado: token no proporcionado.');

        $decoded = $this->verifyToken($token);
        if (!$decoded) return $this->errorResponse(401, 'Acceso denegado: token inválido o expirado.');

        if (!$this->checkRole($decoded->rol->name, $requiredRoles))
            return $this->errorResponse(403, 'Acceso denegado: rol no autorizado.');

        return true;
    }

    /**
     * Igual que handle() pero devuelve el token decodificado para usarlo en el controlador.
     * Útil para verificar ownership (ej: el usuario solo puede editar su propio perfil).
     * @param array $requiredRoles
     * @return object  Token JWT decodificado
     */
    public function handleAndReturn($requiredRoles)
    {
        $token = $this->getTokenFromHeader();
        if (!$token) $this->errorResponse(401, 'Acceso denegado: token no proporcionado.');

        $decoded = $this->verifyToken($token);
        if (!$decoded) $this->errorResponse(401, 'Acceso denegado: token inválido o expirado.');

        if (!$this->checkRole($decoded->rol->name, $requiredRoles))
            $this->errorResponse(403, 'Acceso denegado: rol no autorizado.');

        return $decoded;
    }

    /**
     * Extraer Bearer token del header Authorization.
     */
    private function getTokenFromHeader()
    {
        $headers   = apache_request_headers();
        $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? '';
        if ($authHeader && strpos($authHeader, 'Bearer ') === 0) {
            return str_replace('Bearer ', '', $authHeader);
        }
        return null;
    }

    /**
     * Verificar y decodificar el JWT.
     */
    private function verifyToken($token)
    {
        try {
            return JWT::decode($token, new Key(config::get('SECRET_KEY'), 'HS256'));
        } catch (ExpiredException $e) {
            return false;
        } catch (Exception $e) {
            return false;
        }
    }

    /**
     * Verificar que el rol del usuario esté en los roles permitidos.
     */
    private function checkRole($userRole, $requiredRoles)
    {
        return in_array($userRole, $requiredRoles);
    }

    /**
     * Respuesta de error y detener ejecución.
     */
    private function errorResponse($statusCode, $message)
    {
        http_response_code($statusCode);
        echo json_encode(['success' => false, 'status' => $statusCode, 'message' => $message]);
        exit;
    }
}