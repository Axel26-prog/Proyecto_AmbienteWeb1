<?php
class EstadoPagoModel
{
    public $enlace;

    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }

    /* Listar todos */
    public function all()
    {
        $vSql = "SELECT * FROM estado_pago;";
        return $this->enlace->ExecuteSQL($vSql);
    }

    /* Obtener uno */
    public function get($id)
    {
        $vSql = "SELECT * FROM estado_pago
                 WHERE id_estado_pago = $id;";

        $resultado = $this->enlace->ExecuteSQL($vSql);

        return $resultado[0];
    }

    /* Crear */
    public function create($obj)
    {
        $vSql = "INSERT INTO estado_pago
                 (nombre)
                 VALUES
                 ('$obj->nombre');";

        return $this->enlace->ExecuteSQL_DML($vSql);
    }

    /* Actualizar */
    public function update($obj)
    {
        $vSql = "UPDATE estado_pago SET
                 nombre = '$obj->nombre'
                 WHERE id_estado_pago = $obj->id_estado_pago;";

        return $this->enlace->ExecuteSQL_DML($vSql);
    }

    /* Eliminar */
    public function delete($id)
    {
        $vSql = "DELETE FROM estado_pago
                 WHERE id_estado_pago = $id;";

        return $this->enlace->ExecuteSQL_DML($vSql);
    }
}