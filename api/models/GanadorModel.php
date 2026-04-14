<?php
class GanadorModel
{
    public $enlace;

    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }

    /* Obtener ganador por subasta */
    public function getBySubasta($idSubasta)
    {
        $vSql = "SELECT 
                    g.id_ganador,
                    g.monto_final,
                    g.fecha_asignacion,
                    g.id_subasta,
                    g.id_usuario,
                    CONCAT(u.nombre, ' ', u.apellido) AS nombre_ganador
                FROM ganador g
                INNER JOIN usuario u ON g.id_usuario = u.id_usuario
                WHERE g.id_subasta = $idSubasta;";

        $resultado = $this->enlace->ExecuteSQL($vSql);
        return !empty($resultado) ? $resultado[0] : null;
    }

    /* Crear ganador */
    public function create($idSubasta, $idUsuario, $montoFinal)
    {
        $vSql = "INSERT INTO ganador (monto_final, id_usuario, id_subasta)
                 VALUES ($montoFinal, $idUsuario, $idSubasta);";

        return $this->enlace->executeSQL_DML_last($vSql);
    }

    /* Verificar si ya existe ganador para una subasta */
    public function existeGanador($idSubasta)
    {
        $vSql = "SELECT COUNT(*) AS total FROM ganador WHERE id_subasta = $idSubasta;";
        $resultado = $this->enlace->ExecuteSQL($vSql);
        return $resultado[0]->total > 0;
    }
}