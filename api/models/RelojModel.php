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
    $vSql = "SELECT 
                r.id_reloj,
                r.modelo,
                r.descripcion,
                r.imagen,
                r.anio_fabricacion,
                r.precio_estimado,
                r.fecha_registro,
                m.nombre AS marca,
                c.nombre AS condicion,
                e.nombre AS estado,
                u.id_usuario,
                u.nombre,
                u.apellido
            FROM reloj r
            INNER JOIN marca m 
                ON r.id_marca = m.id_marca
            INNER JOIN condicion c 
                ON r.id_condicion = c.id_condicion
            LEFT JOIN reloj_vendedor rv 
                ON rv.id_reloj = r.id_reloj
            LEFT JOIN estado_reloj_vendedor e 
                ON rv.id_estado_reloj_vendedor = e.id_estado_reloj_vendedor
            LEFT JOIN usuario u 
                ON rv.id_usuario_vendedor = u.id_usuario
            WHERE r.id_reloj = $id;";

    $resultado = $this->enlace->ExecuteSQL($vSql);

    if (empty($resultado)) {
        return null;
    }

    $reloj = $resultado[0];

    $vendedor = null;

    if ($reloj->id_usuario != null) {
        $vendedor = [
            "id_usuario" => $reloj->id_usuario,
            "nombre" => $reloj->nombre,
            "apellido" => $reloj->apellido
        ];
    }

    $relojFinal = [
        "id_reloj" => $reloj->id_reloj,
        "modelo" => $reloj->modelo,
        "descripcion" => $reloj->descripcion,
        "imagen" => $reloj->imagen,
        "anio_fabricacion" => $reloj->anio_fabricacion,
        "precio_estimado" => $reloj->precio_estimado,
        "fecha_registro" => $reloj->fecha_registro,
        "marca" => $reloj->marca,
        "condicion" => $reloj->condicion,
        "estado" => $reloj->estado,
        "vendedor" => $vendedor
    ];

    return $relojFinal;
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

    /*Metodo de buscar el reloj por marca*/
    public function allByMarca($idMarca)
    {
        $vSql = "SELECT r.*, 
                    m.nombre AS marca, 
                    c.nombre AS condicion
             FROM reloj r
             INNER JOIN marca m ON r.id_marca = m.id_marca
             INNER JOIN condicion c ON r.id_condicion = c.id_condicion
             WHERE r.id_marca = $idMarca;";

        return $this->enlace->ExecuteSQL($vSql);
    }
}