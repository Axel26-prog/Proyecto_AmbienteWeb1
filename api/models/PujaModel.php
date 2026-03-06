<?php
class PujaModel
{
    public $enlace;

    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }

    /* Listar todas las pujas */
    public function all()
    {
        $vSql = "SELECT 
                    p.id_puja,
                    p.monto,
                    p.fecha_hora,
                    p.id_usuario,
                    p.id_subasta,
                    CONCAT(u.nombre,' ',u.apellido) AS usuario
                FROM puja p
                INNER JOIN usuario u 
                    ON p.id_usuario = u.id_usuario
                ORDER BY p.fecha_hora DESC;";

        return $this->enlace->ExecuteSQL($vSql);
    }

    /* Obtener una puja por ID */
    public function get($id)
    {
        $vSql = "SELECT 
                    p.id_puja,
                    p.monto,
                    p.fecha_hora,
                    p.id_usuario,
                    p.id_subasta,
                    CONCAT(u.nombre,' ',u.apellido) AS usuario
                FROM puja p
                INNER JOIN usuario u
                    ON p.id_usuario = u.id_usuario
                WHERE p.id_puja = $id;";

        $vResultado = $this->enlace->ExecuteSQL($vSql);

        if (!empty($vResultado))
            return $vResultado[0];
        else
            return null;
    }

    /* Historial de pujas de una subasta */
    public function getBySubasta($idSubasta)
    {
        $vSql = "SELECT 
                    p.id_puja,
                    p.monto,
                    p.fecha_hora,
                    CONCAT(u.nombre,' ',u.apellido) AS usuario
                FROM puja p
                INNER JOIN usuario u 
                    ON p.id_usuario = u.id_usuario
                WHERE p.id_subasta = $idSubasta
                ORDER BY p.fecha_hora DESC;";

        return $this->enlace->ExecuteSQL($vSql);
    }

    /* Contar cantidad de pujas de una subasta (campo calculado) */
    public function countBySubasta($idSubasta)
    {
        $vSql = "SELECT COUNT(*) AS cantidad_pujas
                FROM puja
                WHERE id_subasta = $idSubasta;";

        $vResultado = $this->enlace->ExecuteSQL($vSql);

        return $vResultado[0];
    }

    /* Obtener la puja más alta de una subasta */
    public function getPujaMasAlta($idSubasta)
    {
        $vSql = "SELECT 
                    p.id_puja,
                    p.monto,
                    p.fecha_hora,
                    p.id_usuario
                FROM puja p
                WHERE p.id_subasta = $idSubasta
                ORDER BY p.monto DESC
                LIMIT 1;";

        $vResultado = $this->enlace->ExecuteSQL($vSql);

        if (!empty($vResultado))
            return $vResultado[0];
        else
            return null;
    }

    /* Crear nueva puja */
    public function create($obj)
    {
        $vSql = "INSERT INTO puja
                (
                    monto,
                    fecha_hora,
                    id_usuario,
                    id_subasta
                )
                VALUES
                (
                    $obj->monto,
                    NOW(),
                    $obj->id_usuario,
                    $obj->id_subasta
                );";

        return $this->enlace->ExecuteSQL($vSql);
    }

    /* Obtener pujas realizadas por un usuario */
    public function getByUsuario($idUsuario)
    {
        $vSql = "SELECT 
                    p.id_puja,
                    p.monto,
                    p.fecha_hora,
                    p.id_subasta
                FROM puja p
                WHERE p.id_usuario = $idUsuario
                ORDER BY p.fecha_hora DESC;";

        return $this->enlace->ExecuteSQL($vSql);
    }

    /* Eliminar puja */
    public function delete($id)
    {
        $vSql = "DELETE FROM puja 
                WHERE id_puja = $id;";

        return $this->enlace->ExecuteSQL($vSql);
    }
}