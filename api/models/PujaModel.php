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
                    u.nombre as usuario
                FROM puja p
                INNER JOIN usuario u ON p.id_usuario = u.id_usuario
                ORDER BY p.fecha_hora DESC;";

        return $this->enlace->ExecuteSQL($vSql);
    }

    /* Obtener una puja por ID */
    public function get($id)
    {
        $vSql = "SELECT * FROM puja WHERE id_puja = $id;";

        $vResultado = $this->enlace->ExecuteSQL($vSql);

        return $vResultado[0];
    }

    /* Obtener todas las pujas de una subasta */
    public function getBySubasta($idSubasta)
    {
        $vSql = "SELECT 
                    p.id_puja,
                    p.monto,
                    p.fecha_hora,
                    u.nombre as usuario
                FROM puja p
                INNER JOIN usuario u ON p.id_usuario = u.id_usuario
                WHERE p.id_subasta = $idSubasta
                ORDER BY p.monto DESC;";

        return $this->enlace->ExecuteSQL($vSql);
    }

    /* Obtener la puja más alta de una subasta */
    public function getPujaMasAlta($idSubasta)
    {
        $vSql = "SELECT *
                FROM puja
                WHERE id_subasta = $idSubasta
                ORDER BY monto DESC
                LIMIT 1;";

        $vResultado = $this->enlace->ExecuteSQL($vSql);

        if (!empty($vResultado))
            return $vResultado[0];
        else
            return null;
    }

    /* Crear una nueva puja */
    public function create($obj)
    {
        $vSql = "INSERT INTO puja
                (monto, fecha_hora, id_usuario, id_subasta)
                VALUES
                (
                    $obj->monto,
                    NOW(),
                    $obj->id_usuario,
                    $obj->id_subasta
                );";

        return $this->enlace->ExecuteSQL($vSql);
    }

    /* Obtener pujas de un usuario */
    public function getByUsuario($idUsuario)
    {
        $vSql = "SELECT *
                FROM puja
                WHERE id_usuario = $idUsuario
                ORDER BY fecha_hora DESC;";

        return $this->enlace->ExecuteSQL($vSql);
    }

    /* Eliminar puja */
    public function delete($id)
    {
        $vSql = "DELETE FROM puja WHERE id_puja = $id;";

        return $this->enlace->ExecuteSQL($vSql);
    }
}