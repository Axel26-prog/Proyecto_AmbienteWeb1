<?php
class EstadoRelojVendedorModel
{
    public $enlace;

    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }

    /* Listar todos */
    public function all()
    {
        $vSql = "SELECT * FROM estado_reloj_vendedor;";
        return $this->enlace->ExecuteSQL($vSql);
    }

    /* Obtener uno */
    public function get($id)
    {
        $vSql = "SELECT * FROM estado_reloj_vendedor
                 WHERE id_estado_reloj_vendedor = $id;";

        $resultado = $this->enlace->ExecuteSQL($vSql);

        return $resultado[0];
    }

    /* Crear */
    public function create($obj)
    {
        $vSql = "INSERT INTO estado_reloj_vendedor
                 (nombre)
                 VALUES
                 ('$obj->nombre');";

        return $this->enlace->ExecuteSQL_DML($vSql);
    }

    /* Actualizar */
    public function update($obj)
    {
        $vSql = "UPDATE estado_reloj_vendedor SET
                 nombre = '$obj->nombre'
                 WHERE id_estado_reloj_vendedor = $obj->id_estado_reloj_vendedor;";

        return $this->enlace->ExecuteSQL_DML($vSql);
    }

    /* Eliminar */
    public function delete($id)
    {
        $vSql = "DELETE FROM estado_reloj_vendedor
                 WHERE id_estado_reloj_vendedor = $id;";

        return $this->enlace->ExecuteSQL_DML($vSql);
    }
}