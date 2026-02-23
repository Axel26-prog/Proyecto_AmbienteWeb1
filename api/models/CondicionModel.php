<?php
class CondicionModel
{
    public $enlace;

    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }

    /* Listar todas las condiciones */
    public function all()
    {
        // Consulta SQL
        $vSql = "SELECT * FROM condicion;";

        // Ejecutar consulta
        $vResultado = $this->enlace->ExecuteSQL($vSql);

        // Retornar resultado
        return $vResultado;
    }

    /* Obtener una condición por ID */
    public function get($id)
    {
        // Consulta SQL
        $vSql = "SELECT * FROM condicion WHERE id_condicion = $id;";

        // Ejecutar consulta
        $vResultado = $this->enlace->ExecuteSQL($vSql);

        // Retornar el primer resultado
        return $vResultado[0];
    }

    /* Crear nueva condición */
    public function create($obj)
    {
        // Consulta SQL
        $vSql = "INSERT INTO condicion (nombre)
                 VALUES ('$obj->nombre');";

        // Ejecutar consulta
        return $this->enlace->ExecuteSQL($vSql);
    }

    /* Actualizar condición */
    public function update($obj)
    {
        // Consulta SQL
        $vSql = "UPDATE condicion 
                 SET nombre = '$obj->nombre'
                 WHERE id_condicion = $obj->id_condicion;";

        // Ejecutar consulta
        return $this->enlace->ExecuteSQL($vSql);
    }

    /* Eliminar condición */
    public function delete($id)
    {
        // Consulta SQL
        $vSql = "DELETE FROM condicion WHERE id_condicion = $id;";

        // Ejecutar consulta
        return $this->enlace->ExecuteSQL($vSql);
    }
}