<?php
class GanadorModel
{
    public $enlace;

    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }

    /* Listar todos los ganadores */
    public function all()
    {
        // Consulta SQL con información adicional del usuario y subasta
        $vSql = "SELECT 
                    g.id_ganador,
                    g.monto_final,
                    g.fecha_asignacion,
                    g.id_usuario,
                    g.id_subasta,
                    u.nombre as usuario,
                    s.id_subasta as subasta
                FROM ganador g
                INNER JOIN usuario u ON g.id_usuario = u.id_usuario
                INNER JOIN subasta s ON g.id_subasta = s.id_subasta;";

        // Ejecutar consulta
        $vResultado = $this->enlace->ExecuteSQL($vSql);

        return $vResultado;
    }

    /* Obtener un ganador por ID */
    public function get($id)
    {
        $vSql = "SELECT 
                    id_ganador,
                    monto_final,
                    fecha_asignacion,
                    id_usuario,
                    id_subasta
                FROM ganador
                WHERE id_ganador = $id;";

        $vResultado = $this->enlace->ExecuteSQL($vSql);

        return $vResultado[0];
    }

    /* Obtener ganador por subasta */
    public function getBySubasta($idSubasta)
    {
        $vSql = "SELECT *
                FROM ganador
                WHERE id_subasta = $idSubasta;";

        $vResultado = $this->enlace->ExecuteSQL($vSql);

        return $vResultado;
    }

    /* Crear ganador */
    public function create($obj)
    {
        $vSql = "INSERT INTO ganador
                (monto_final, fecha_asignacion, id_usuario, id_subasta)
                VALUES
                (
                    $obj->monto_final,
                    NOW(),
                    $obj->id_usuario,
                    $obj->id_subasta
                );";

        return $this->enlace->ExecuteSQL($vSql);
    }

    /* Actualizar ganador */
    public function update($obj)
    {
        $vSql = "UPDATE ganador
                SET
                    monto_final = $obj->monto_final,
                    id_usuario = $obj->id_usuario,
                    id_subasta = $obj->id_subasta
                WHERE id_ganador = $obj->id_ganador;";

        return $this->enlace->ExecuteSQL($vSql);
    }

    /* Eliminar ganador */
    public function delete($id)
    {
        $vSql = "DELETE FROM ganador WHERE id_ganador = $id;";

        return $this->enlace->ExecuteSQL($vSql);
    }
}