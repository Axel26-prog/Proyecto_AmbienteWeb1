<?php
class EstadoSubastaModel
{
    public $enlace;

    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }

    /* Listar todos */
    public function all()
    {
        $vSql = "SELECT * FROM estado_subasta;";
        return $this->enlace->ExecuteSQL($vSql);
    }

    /* Obtener uno */
    public function get($id)
    {
        $vSql = "SELECT * FROM estado_subasta
                 WHERE id_estado_subasta = $id;";

        $resultado = $this->enlace->ExecuteSQL($vSql);

        return $resultado[0];
    }

    /* Crear */
    public function create($obj)
    {
        $vSql = "INSERT INTO estado_subasta
                 (nombre)
                 VALUES
                 ('$obj->nombre');";

        return $this->enlace->ExecuteSQL_DML($vSql);
    }

    /* Actualizar */
    public function update($obj)
    {
        $vSql = "UPDATE estado_subasta SET
                 nombre = '$obj->nombre'
                 WHERE id_estado_subasta = $obj->id_estado_subasta;";

        return $this->enlace->ExecuteSQL_DML($vSql);
    }

    /* Eliminar */
    public function delete($id)
    {
        $vSql = "DELETE FROM estado_subasta
                 WHERE id_estado_subasta = $id;";

        return $this->enlace->ExecuteSQL_DML($vSql);
    }
}