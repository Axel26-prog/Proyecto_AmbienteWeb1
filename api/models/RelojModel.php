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
    $vSql = "SELECT r.*,
                    rv.id_reloj_vendedor,
                    u.id_usuario,
                    u.nombre,
                    u.apellido
            FROM reloj r
            LEFT JOIN reloj_vendedor rv 
                ON r.id_reloj = rv.id_reloj
            LEFT JOIN usuario u 
                ON rv.id_usuario_vendedor = u.id_usuario
            WHERE r.id_reloj = $id;";

    $resultado = $this->enlace->ExecuteSQL($vSql);

    if (empty($resultado)) {
        return null;
    }

    $reloj = $resultado[0];

    // Valores por defecto
    $vendedor = null;
    $historial = [];

    // Si tiene vendedor
    if ($reloj->id_reloj_vendedor != null) {

        $vendedor = [
            "id_usuario" => $reloj->id_usuario,
            "nombre" => $reloj->nombre,
            "apellido" => $reloj->apellido
        ];

        // Buscar historial
        $vSqlHistorial = "SELECT 
                                id_subasta,
                                fecha_inicio,
                                fecha_fin,
                                precio_inicial,
                                incremento_minimo,
                                id_estado_subasta
                          FROM subasta
                          WHERE id_reloj_vendedor = $reloj->id_reloj_vendedor;";

        $historial = $this->enlace->ExecuteSQL($vSqlHistorial) ?? [];
    }

    // Construcción final SIEMPRE aquí
    $relojFinal = [
        "id_reloj" => $reloj->id_reloj,
        "modelo" => $reloj->modelo,
        "descripcion" => $reloj->descripcion,
        "imagen" => $reloj->imagen,
        "anio_fabricacion" => $reloj->anio_fabricacion,
        "precio_estimado" => $reloj->precio_estimado,
        "vendedor" => $vendedor,
        "historial_subastas" => $historial
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
}