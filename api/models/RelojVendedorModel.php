<?php
class RelojVendedorModel
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
                    rv.id_reloj_vendedor,
                    rv.fecha_publicacion,
                    rv.id_reloj,
                    r.modelo,
                    rv.id_usuario_vendedor,
                    u.nombre,
                    u.apellido,
                    rv.id_estado_reloj_vendedor,
                    erv.nombre AS estado
                FROM reloj_vendedor rv
                INNER JOIN reloj r ON rv.id_reloj = r.id_reloj
                INNER JOIN usuario u ON rv.id_usuario_vendedor = u.id_usuario
                INNER JOIN estado_reloj_vendedor erv 
                    ON rv.id_estado_reloj_vendedor = erv.id_estado_reloj_vendedor;";

        return $this->enlace->ExecuteSQL($vSql);
    }

    /* Obtener uno */
    public function get($id)
    {
        $vSql = "SELECT 
                    rv.*,
                    r.modelo,
                    u.nombre,
                    u.apellido,
                    erv.nombre AS estado
                FROM reloj_vendedor rv
                INNER JOIN reloj r ON rv.id_reloj = r.id_reloj
                INNER JOIN usuario u ON rv.id_usuario_vendedor = u.id_usuario
                INNER JOIN estado_reloj_vendedor erv 
                    ON rv.id_estado_reloj_vendedor = erv.id_estado_reloj_vendedor
                WHERE rv.id_reloj_vendedor = $id;";

        $resultado = $this->enlace->ExecuteSQL($vSql);
        return $resultado[0];
    }

    /* Obtener por vendedor */
    public function getByVendedor($idUsuario)
    {
        $vSql = "SELECT *
                FROM reloj_vendedor
                WHERE id_usuario_vendedor = $idUsuario;";

        return $this->enlace->ExecuteSQL($vSql);
    }

    /* Crear */
    public function create($obj)
    {
        $vSql = "INSERT INTO reloj_vendedor
                (id_reloj, id_usuario_vendedor, fecha_publicacion, id_estado_reloj_vendedor)
                VALUES
                (
                    '$obj->id_reloj',
                    '$obj->id_usuario_vendedor',
                    '$obj->fecha_publicacion',
                    '$obj->id_estado_reloj_vendedor'
                )";

        return $this->enlace->ExecuteSQL_DML($vSql);
    }

    /* Actualizar */
    public function update($obj)
    {
        $vSql = "UPDATE reloj_vendedor SET
                    id_reloj = '$obj->id_reloj',
                    id_usuario_vendedor = '$obj->id_usuario_vendedor',
                    fecha_publicacion = '$obj->fecha_publicacion',
                    id_estado_reloj_vendedor = '$obj->id_estado_reloj_vendedor'
                WHERE id_reloj_vendedor = $obj->id_reloj_vendedor";

        return $this->enlace->ExecuteSQL_DML($vSql);
    }

    /* Eliminar */
    public function delete($id)
    {
        $vSql = "DELETE FROM reloj_vendedor 
                WHERE id_reloj_vendedor = $id";

        return $this->enlace->ExecuteSQL_DML($vSql);
    }
}