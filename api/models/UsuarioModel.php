<?php
class UsuarioModel
{
    public $enlace;

    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }

    /* Listar todos los usuarios */
    public function all()
    {
        $vSql = "SELECT u.id_usuario,
                        u.nombre,
                        u.apellido,
                        u.correo,
                        u.telefono,
                        u.fecha_registro,
                        r.nombre AS rol,
                        eu.nombre AS estado
                 FROM usuario u
                 INNER JOIN rol r
                    ON u.id_rol = r.id_rol
                 INNER JOIN estado_usuario eu
                    ON u.id_estado_usuario = eu.id_estado_usuario;";

        return $this->enlace->ExecuteSQL($vSql);
    }

    /* Obtener usuario por ID */
    public function get($id)
    {
        $vSql = "SELECT u.id_usuario,
                        u.nombre,
                        u.apellido,
                        u.correo,
                        u.telefono,
                        u.fecha_registro,
                        r.nombre AS rol,
                        eu.nombre AS estado
                 FROM usuario u
                 INNER JOIN rol r
                    ON u.id_rol = r.id_rol
                 INNER JOIN estado_usuario eu
                    ON u.id_estado_usuario = eu.id_estado_usuario
                 WHERE u.id_usuario=$id;";

        $vResultado = $this->enlace->ExecuteSQL($vSql);

        return $vResultado[0];
    }

    /* Obtener detalle con historial */
public function getDetalle($id)
{
    $vSql = "SELECT 
                u.id_usuario,
                u.nombre,
                u.apellido,
                u.correo,
                u.telefono,
                u.fecha_registro,
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

    /* Crear usuario */
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
                        '$obj->fecha_registro',
                        $obj->id_rol,
                        $obj->id_estado_usuario
                    );";

        return $this->enlace->ExecuteSQL($vSql);
    }

    /* Actualizar usuario */
    public function update($obj)
    {
        $vSql = "UPDATE usuario SET
                    nombre='$obj->nombre',
                    apellido='$obj->apellido',
                    correo='$obj->correo',
                    contrasena='$obj->contrasena',
                    telefono='$obj->telefono',
                    id_rol=$obj->id_rol,
                    id_estado_usuario=$obj->id_estado_usuario
                 WHERE id_usuario=$obj->id_usuario;";

        return $this->enlace->ExecuteSQL($vSql);
    }

    /* Eliminar usuario */
    public function delete($id)
    {
        $vSql = "DELETE FROM usuario
                 WHERE id_usuario=$id;";

        return $this->enlace->ExecuteSQL($vSql);
    }

    /* Login */
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