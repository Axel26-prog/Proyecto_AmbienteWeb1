<?php
class RolModel
{
    public $enlace;

    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }

    /* Listar todos */
    public function all()
    {
        $vSql = "SELECT * FROM rol;";

        $vResultado = $this->enlace->ExecuteSQL($vSql);

        return $vResultado;
    }

    /* Obtener por ID */
    public function get($id)
    {
        $vSql = "SELECT * FROM rol WHERE id_rol=$id;";

        $vResultado = $this->enlace->ExecuteSQL($vSql);

        return $vResultado[0];
    }

    /* Crear */
    public function create($obj)
    {
        $vSql = "INSERT INTO rol (nombre)
                 VALUES ('$obj->nombre');";

        return $this->enlace->ExecuteSQL($vSql);
    }

    /* Actualizar */
    public function update($obj)
    {
        $vSql = "UPDATE rol SET
                    nombre='$obj->nombre'
                 WHERE id_rol=$obj->id_rol;";

        return $this->enlace->ExecuteSQL($vSql);
    }

    /* Eliminar */
    public function delete($id)
    {
        $vSql = "DELETE FROM rol
                 WHERE id_rol=$id;";

        return $this->enlace->ExecuteSQL($vSql);
    }
}