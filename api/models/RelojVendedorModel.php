<?php
class RelojVendedorModel
{
    public $enlace;

    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }

    /* Obtener id_reloj_vendedor por id_reloj */
    public function getByReloj($idReloj)
    {
        $vSql = "SELECT 
                    rv.id_reloj_vendedor,
                    rv.id_reloj,
                    rv.id_usuario_vendedor,
                    u.nombre,
                    u.apellido,
                    erv.nombre AS estado_reloj_vendedor
                 FROM reloj_vendedor rv
                 INNER JOIN usuario u
                    ON rv.id_usuario_vendedor = u.id_usuario
                 INNER JOIN estado_reloj_vendedor erv
                    ON rv.id_estado_reloj_vendedor = erv.id_estado_reloj_vendedor
                 WHERE rv.id_reloj = $idReloj
                 LIMIT 1;";

        $resultado = $this->enlace->ExecuteSQL($vSql);

        return !empty($resultado) ? $resultado[0] : null;
    }
}