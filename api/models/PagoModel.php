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
            WHERE p.id_ganador = $idGanador;";

        return $this->enlace->ExecuteSQL($vSql);
    }

    /*obtiener el pago por usuario */
    public function getByUsuario($idUsuario)
{
    $vSql = "SELECT 
                p.id_pago,
                p.monto,
                p.fecha_pago,
                p.id_estado_pago,
                ep.nombre AS estado_pago,
                p.id_metodo_pago,
                mp.nombre AS metodo_pago,
                g.id_ganador,
                g.id_subasta,
                g.monto_final,
                g.fecha_asignacion,
                s.fecha_inicio,
                s.fecha_fin,
                r.id_reloj,
                r.modelo,
                r.imagen,
                m.nombre AS marca
            FROM pago p
            INNER JOIN ganador g ON p.id_ganador = g.id_ganador
            INNER JOIN estado_pago ep ON p.id_estado_pago = ep.id_estado_pago
            INNER JOIN metodo_pago mp ON p.id_metodo_pago = mp.id_metodo_pago
            INNER JOIN subasta s ON g.id_subasta = s.id_subasta
            INNER JOIN reloj_vendedor rv ON s.id_reloj_vendedor = rv.id_reloj_vendedor
            INNER JOIN reloj r ON rv.id_reloj = r.id_reloj
            INNER JOIN marca m ON r.id_marca = m.id_marca
            WHERE g.id_usuario = $idUsuario
            ORDER BY p.id_estado_pago ASC, g.fecha_asignacion DESC;";

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
