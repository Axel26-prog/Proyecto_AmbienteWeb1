<?php
class RelojModel
{
    public $enlace;

    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }

    /* Listar todos */
    public function all()
    {
        $vSql = "SELECT r.*, 
                        m.nombre AS marca, 
                        c.nombre AS condicion
                 FROM reloj r
                 INNER JOIN marca m ON r.id_marca = m.id_marca
                 INNER JOIN condicion c ON r.id_condicion = c.id_condicion;";

        $vResultado = $this->enlace->ExecuteSQL($vSql);

        return $vResultado;
    }

    /* Obtener por ID */
    public function get($id)
    {
        $vSql = "SELECT * FROM reloj WHERE id_reloj=$id;";

        $vResultado = $this->enlace->ExecuteSQL($vSql);

        return $vResultado[0];
    }

    /* Crear */
    public function create($obj)
    {
        $vSql = "INSERT INTO reloj
                (modelo, descripcion, imagen, anio_fabricacion, precio_estimado, id_marca, id_condicion)
                VALUES
                (
                    '$obj->modelo',
                    '$obj->descripcion',
                    '$obj->imagen',
                    '$obj->anio_fabricacion',
                    '$obj->precio_estimado',
                    $obj->id_marca,
                    $obj->id_condicion
                );";

        return $this->enlace->ExecuteSQL($vSql);
    }

    /* Actualizar */
    public function update($obj)
    {
        $vSql = "UPDATE reloj SET
                    modelo='$obj->modelo',
                    descripcion='$obj->descripcion',
                    imagen='$obj->imagen',
                    anio_fabricacion='$obj->anio_fabricacion',
                    precio_estimado='$obj->precio_estimado',
                    id_marca=$obj->id_marca,
                    id_condicion=$obj->id_condicion
                 WHERE id_reloj=$obj->id_reloj;";

        return $this->enlace->ExecuteSQL($vSql);
    }

    /* Eliminar */
    public function delete($id)
    {
        $vSql = "DELETE FROM reloj WHERE id_reloj=$id;";

        return $this->enlace->ExecuteSQL($vSql);
    }
}