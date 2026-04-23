<?php
class UsuarioModel
{
    public $enlace;

    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }

    private function escape($value)
    {
        $conn = new mysqli(
            Config::get('DB_HOST'),
            Config::get('DB_USERNAME'),
            Config::get('DB_PASSWORD'),
            Config::get('DB_DBNAME')
        );
        $escaped = mysqli_real_escape_string($conn, $value);
        $conn->close();
        return $escaped;
    }

    public function all()
    {
        $vSql = "SELECT u.id_usuario,
                        u.nombre,
                        u.apellido,
                        u.correo,
                        u.telefono,
                        u.fecha_registro,
                        u.id_rol,
                        u.id_estado_usuario,
                        r.nombre AS rol,
                        eu.nombre AS estado
                 FROM usuario u
                 INNER JOIN rol r ON u.id_rol = r.id_rol
                 INNER JOIN estado_usuario eu ON u.id_estado_usuario = eu.id_estado_usuario;";

        return $this->enlace->executeSQL($vSql);
    }

    public function get($id)
    {
        $id = intval($id);
        $vSql = "SELECT u.id_usuario,
                        u.nombre,
                        u.apellido,
                        u.correo,
                        u.telefono,
                        u.fecha_registro,
                        u.id_rol,
                        u.id_estado_usuario,
                        r.nombre AS rol,
                        eu.nombre AS estado
                 FROM usuario u
                 INNER JOIN rol r ON u.id_rol = r.id_rol
                 INNER JOIN estado_usuario eu ON u.id_estado_usuario = eu.id_estado_usuario
                 WHERE u.id_usuario = $id;";

        $vResultado = $this->enlace->ExecuteSQL($vSql);
        return $vResultado[0];
    }

    public function getDetalle($id)
    {
        $id = intval($id);
        $vSql = "SELECT 
                    u.id_usuario,
                    u.nombre,
                    u.apellido,
                    u.correo,
                    u.telefono,
                    u.fecha_registro,
                    u.id_rol,
                    u.id_estado_usuario,
                    r.nombre AS rol,
                    eu.nombre AS estado,
                    (
                        SELECT COUNT(*)
                        FROM subasta s
                        INNER JOIN reloj_vendedor rv ON s.id_reloj_vendedor = rv.id_reloj_vendedor
                        WHERE rv.id_usuario_vendedor = u.id_usuario
                    ) AS cantidad_subastas,
                    (
                        SELECT COUNT(*)
                        FROM puja p
                        WHERE p.id_usuario = u.id_usuario
                    ) AS cantidad_pujas
                FROM usuario u
                INNER JOIN rol r ON u.id_rol = r.id_rol
                INNER JOIN estado_usuario eu ON u.id_estado_usuario = eu.id_estado_usuario
                WHERE u.id_usuario = $id;";

        $vResultado = $this->enlace->ExecuteSQL($vSql);
        return $vResultado[0];
    }

    public function getByCorreo($correo)
    {
        $correo = $this->escape($correo);
        $vSql = "SELECT u.*,
                        r.nombre AS rol,
                        eu.nombre AS estado
                 FROM usuario u
                 INNER JOIN rol r ON u.id_rol = r.id_rol
                 INNER JOIN estado_usuario eu ON u.id_estado_usuario = eu.id_estado_usuario
                 WHERE u.correo = '$correo'
                 LIMIT 1;";

        $vResultado = $this->enlace->ExecuteSQL($vSql);
        return !empty($vResultado) ? $vResultado[0] : null;
    }

    public function create($obj)
    {
        $hash     = password_hash($obj->contrasena, PASSWORD_BCRYPT);
        $nombre   = $this->escape($obj->nombre);
        $apellido = $this->escape($obj->apellido);
        $correo   = $this->escape($obj->correo);
        $telefono = isset($obj->telefono) ? $this->escape($obj->telefono) : '';
        $id_rol   = intval($obj->id_rol);
        $id_estado = isset($obj->id_estado_usuario) ? intval($obj->id_estado_usuario) : 1;

        $vSql = "INSERT INTO usuario
                    (nombre, apellido, correo, contrasena, telefono, fecha_registro, id_rol, id_estado_usuario)
                 VALUES
                    ('$nombre', '$apellido', '$correo', '$hash', '$telefono', NOW(), $id_rol, $id_estado);";

        return $this->enlace->executeSQL_DML_last($vSql);
    }

    public function update($obj)
    {
        $nombre   = $this->escape($obj->nombre);
        $apellido = $this->escape($obj->apellido);
        $correo   = $this->escape($obj->correo);
        $telefono = isset($obj->telefono) ? $this->escape($obj->telefono) : '';
        $id       = intval($obj->id_usuario);

        $vSql = "UPDATE usuario SET
                    nombre   = '$nombre',
                    apellido = '$apellido',
                    correo   = '$correo',
                    telefono = '$telefono'
                 WHERE id_usuario = $id;";

        return $this->enlace->executeSQL_DML($vSql);
    }

    public function delete($id)
    {
        $id = intval($id);
        $usuario = $this->get($id);
        $nuevoEstado = ($usuario->id_estado_usuario == 1) ? 2 : 1;

        $vSql = "UPDATE usuario
                 SET id_estado_usuario = $nuevoEstado
                 WHERE id_usuario = $id;";

        return $this->enlace->executeSQL_DML($vSql);
    }

    public function suspend($id)
    {
        $id = intval($id);
        $vSql = "UPDATE usuario
                 SET id_estado_usuario = 3
                 WHERE id_usuario = $id;";

        return $this->enlace->executeSQL_DML($vSql);
    }

    public function login($correo, $contrasena)
    {
        $usuario = $this->getByCorreo($correo);

        if (!$usuario) return null;

        if (!password_verify($contrasena, $usuario->contrasena)) return null;

        unset($usuario->contrasena);

        return $usuario;
    }
}