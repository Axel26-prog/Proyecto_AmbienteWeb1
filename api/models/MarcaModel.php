<?php
class MarcaModel
{
    public $enlace;

    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }

    /* Listar todas las marcas */
    public function all()
    {
        $vSql = "SELECT * FROM marca;";

        $vResultado = $this->enlace->ExecuteSQL($vSql);

        return $vResultado;
    }

    /* Obtener una marca por ID */
    public function get($id)
    {
        $vSql = "SELECT * FROM marca WHERE id_marca = $id;";

        $vResultado = $this->enlace->ExecuteSQL($vSql);

        return $vResultado[0];
    }

    /* Crear nueva marca */
    public function create($obj)
    {
        $vSql = "INSERT INTO marca (nombre)
                 VALUES ('$obj->nombre');";

        return $this->enlace->ExecuteSQL($vSql);
    }

    /* Actualizar marca */
    public function update($obj)
    {
        $vSql = "UPDATE marca
                 SET nombre = '$obj->nombre'
                 WHERE id_marca = $obj->id_marca;";

        return $this->enlace->ExecuteSQL($vSql);
    }

    /* Eliminar marca */
    public function delete($id)
    {
        $vSql = "DELETE FROM marca WHERE id_marca = $id;";

        return $this->enlace->ExecuteSQL($vSql);
    }
}