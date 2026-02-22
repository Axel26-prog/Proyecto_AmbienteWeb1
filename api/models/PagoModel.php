<?php
class PagoModel
{
    public $enlace;

    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }

    /* Listar todos */
    public function all()
    {
        $vSql = "SELECT 
                    p.id_pago,
                    p.monto,
                    p.fecha_pago,
                    p.id_ganador,
                    ep.nombre AS estado_pago,
                    mp.nombre AS metodo_pago
                FROM pago p
                INNER JOIN estado_pago ep ON p.id_estado_pago = ep.id_estado_pago
                INNER JOIN metodo_pago mp ON p.id_metodo_pago = mp.id_metodo_pago;";

        return $this->enlace->ExecuteSQL($vSql);
    }

    /* Obtener uno */
    public function get($id)
    {
        $vSql = "SELECT 
                    p.id_pago,
                    p.monto,
                    p.fecha_pago,
                    p.id_ganador,
                    p.id_estado_pago,
                    ep.nombre AS estado_pago,
                    p.id_metodo_pago,
                    mp.nombre AS metodo_pago
                FROM pago p
                INNER JOIN estado_pago ep ON p.id_estado_pago = ep.id_estado_pago
                INNER JOIN metodo_pago mp ON p.id_metodo_pago = mp.id_metodo_pago
                WHERE p.id_pago = $id;";

        $resultado = $this->enlace->ExecuteSQL($vSql);
        return $resultado[0];
    }

    /* Obtener pagos por ganador */
    public function getByGanador($idGanador)
    {
        $vSql = "SELECT *
                FROM pago
                WHERE id_ganador = $idGanador;";

        return $this->enlace->ExecuteSQL($vSql);
    }

    /* Crear */
    public function create($obj)
    {
        $vSql = "INSERT INTO pago
                (monto, fecha_pago, id_ganador, id_estado_pago, id_metodo_pago)
                VALUES
                (
                    '$obj->monto',
                    '$obj->fecha_pago',
                    '$obj->id_ganador',
                    '$obj->id_estado_pago',
                    '$obj->id_metodo_pago'
                )";

        return $this->enlace->ExecuteSQL_DML($vSql);
    }

    /* Actualizar */
    public function update($obj)
    {
        $vSql = "UPDATE pago SET
                    monto = '$obj->monto',
                    fecha_pago = '$obj->fecha_pago',
                    id_ganador = '$obj->id_ganador',
                    id_estado_pago = '$obj->id_estado_pago',
                    id_metodo_pago = '$obj->id_metodo_pago'
                WHERE id_pago = $obj->id_pago";

        return $this->enlace->ExecuteSQL_DML($vSql);
    }

    /* Eliminar */
    public function delete($id)
    {
        $vSql = "DELETE FROM pago WHERE id_pago = $id";

        return $this->enlace->ExecuteSQL_DML($vSql);
    }
}