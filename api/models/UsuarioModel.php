<?php
class UsuarioModel
{
    public $enlace;

    public function __construct()
    {
        $this->enlace = new MySqlConnect();
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
             INNER JOIN rol r
                ON u.id_rol = r.id_rol
             INNER JOIN estado_usuario eu
                ON u.id_estado_usuario = eu.id_estado_usuario
             WHERE u.id_estado_usuario = 1;";

    return $this->enlace->executeSQL($vSql);
}

    public function get($id)
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
                 INNER JOIN rol r
                    ON u.id_rol = r.id_rol
                 INNER JOIN estado_usuario eu
                    ON u.id_estado_usuario = eu.id_estado_usuario
                 WHERE u.id_usuario = $id;";

        $vResultado = $this->enlace->ExecuteSQL($vSql);
        return $vResultado[0];
    }

    public function getDetalle($id)
    {
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
                        INNER JOIN reloj_vendedor rv 
                            ON s.id_reloj_vendedor = rv.id_reloj_vendedor
                        WHERE rv.id_usuario_vendedor = u.id_usuario
                    ) AS cantidad_subastas,

                    (
                        SELECT COUNT(*)
                        FROM puja p
                        WHERE p.id_usuario = u.id_usuario
                    ) AS cantidad_pujas

                FROM usuario u
                INNER JOIN rol r
                    ON u.id_rol = r.id_rol
                INNER JOIN estado_usuario eu
                    ON u.id_estado_usuario = eu.id_estado_usuario
                WHERE u.id_usuario = $id;";

        $vResultado = $this->enlace->ExecuteSQL($vSql);
        return $vResultado[0];
    }

    public function create($obj)
{
    $vSql = "INSERT INTO usuario
                (nombre,
                 apellido,
                 correo,
                 contrasena,
                 telefono,
                 fecha_registro,
                 id_rol,
                 id_estado_usuario)
             VALUES
                (
                    '$obj->nombre',
                    '$obj->apellido',
                    '$obj->correo',
                    '$obj->contrasena',
                    '$obj->telefono',
                    NOW(),
                    $obj->id_rol,
                    $obj->id_estado_usuario
                );";

    return $this->enlace->executeSQL_DML_last($vSql);
}

    public function update($obj)
    {
        $vSql = "UPDATE usuario SET
                    nombre = '$obj->nombre',
                    apellido = '$obj->apellido',
                    correo = '$obj->correo'
                 WHERE id_usuario = $obj->id_usuario;";

        return $this->enlace->executeSQL_DML($vSql);
    }

    public function delete($id)
    {
        $usuario = $this->get($id);

        $nuevoEstado = ($usuario->id_estado_usuario == 1) ? 2 : 1;

        $vSql = "UPDATE usuario
                 SET id_estado_usuario = $nuevoEstado
                 WHERE id_usuario = $id;";

        return $this->enlace->executeSQL_DML($vSql);
    }

    public function login($correo, $contrasena)
    {
        $vSql = "SELECT u.*,
                        r.nombre AS rol,
                        eu.nombre AS estado
                 FROM usuario u
                 INNER JOIN rol r
                    ON u.id_rol = r.id_rol
                 INNER JOIN estado_usuario eu
                    ON u.id_estado_usuario = eu.id_estado_usuario
                 WHERE u.correo='$correo'
                 AND u.contrasena='$contrasena';";

        $vResultado = $this->enlace->ExecuteSQL($vSql);

        if (!empty($vResultado))
            return $vResultado[0];
        else
            return null;
    }
}
