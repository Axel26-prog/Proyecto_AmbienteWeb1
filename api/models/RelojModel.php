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
        $vSql = "SELECT 
                r.*,
                er.nombre AS estado,
                m.nombre AS marca,
                c.nombre AS condicion,
                erv.nombre AS estado_vendedor,
                GROUP_CONCAT(cat.nombre SEPARATOR ', ') AS categorias
            FROM reloj r
            INNER JOIN estado_reloj er
                ON r.id_estado = er.id_estado
            INNER JOIN marca m 
                ON r.id_marca = m.id_marca
            INNER JOIN condicion c 
                ON r.id_condicion = c.id_condicion
            LEFT JOIN reloj_vendedor rv
                ON r.id_reloj = rv.id_reloj
            LEFT JOIN estado_reloj_vendedor erv
                ON rv.id_estado_reloj_vendedor = erv.id_estado_reloj_vendedor
            LEFT JOIN reloj_categoria rc
                ON r.id_reloj = rc.id_reloj
            LEFT JOIN categoria cat
                ON rc.id_categoria = cat.id_categoria
            GROUP BY r.id_reloj;";

        return $this->enlace->ExecuteSQL($vSql);

    }

    /* Obtener por ID */
   public function get($id)
{
    /* CONSULTA PRINCIPAL DEL RELOJ */

    $vSql = "SELECT 
        r.id_reloj,
        r.modelo,
        r.descripcion,
        r.imagen,
        r.anio_fabricacion,
        r.precio_estimado,
        r.fecha_registro,
        r.id_marca,
        r.id_condicion,
        m.nombre AS marca,
        c.nombre AS condicion,
        er.nombre AS estado,
        erv.nombre AS estado_vendedor,
        u.id_usuario,
        u.nombre,
        u.apellido

    FROM reloj r
    INNER JOIN marca m 
        ON r.id_marca = m.id_marca
    INNER JOIN condicion c 
        ON r.id_condicion = c.id_condicion
    INNER JOIN estado_reloj er
        ON r.id_estado = er.id_estado
    LEFT JOIN reloj_vendedor rv 
        ON rv.id_reloj = r.id_reloj
    LEFT JOIN estado_reloj_vendedor erv 
        ON rv.id_estado_reloj_vendedor = erv.id_estado_reloj_vendedor
    LEFT JOIN usuario u 
        ON rv.id_usuario_vendedor = u.id_usuario
    WHERE r.id_reloj = $id";

    $resultado = $this->enlace->ExecuteSQL($vSql);

    if (empty($resultado)) {
        return null;
    }

    $reloj = $resultado[0];

    /* CONSULTA CATEGORIAS */

    $vSqlCategorias = "SELECT c.id_categoria, c.nombre
                   FROM reloj_categoria rc
                   INNER JOIN categoria c
                   ON rc.id_categoria = c.id_categoria
                   WHERE rc.id_reloj = $id";

    $categorias = $this->enlace->ExecuteSQL($vSqlCategorias);

    $listaCategorias = [];

    if (!empty($categorias)) {
        foreach ($categorias as $cat) {
            $listaCategorias[] = [
                "id_categoria" => $cat->id_categoria,
                "nombre"       => $cat->nombre
            ];
        }
    }

    /* INFORMACIÓN DEL VENDEDOR */

    $vendedor = null;

    if ($reloj->id_usuario != null) {
        $vendedor = [
            "id_usuario" => $reloj->id_usuario,
            "nombre"     => $reloj->nombre,
            "apellido"   => $reloj->apellido
        ];
    }

    /* HISTORIAL DE SUBASTAS */

    $vSqlHistorial = "SELECT 
                    s.id_subasta,
                    s.fecha_inicio,
                    s.fecha_fin,
                    s.precio_inicial,
                    s.incremento_minimo,
                    es.nombre AS estado_subasta,
                    COUNT(p.id_puja) AS cantidad_pujas
                  FROM reloj_vendedor rv
                  INNER JOIN subasta s
                    ON s.id_reloj_vendedor = rv.id_reloj_vendedor
                  INNER JOIN estado_subasta es
                    ON s.id_estado_subasta = es.id_estado_subasta
                  LEFT JOIN puja p
                    ON p.id_subasta = s.id_subasta
                  WHERE rv.id_reloj = $id
                  GROUP BY 
                    s.id_subasta,
                    s.fecha_inicio,
                    s.fecha_fin,
                    s.precio_inicial,
                    s.incremento_minimo,
                    es.nombre
                  ORDER BY s.fecha_inicio DESC";

    $historial = $this->enlace->ExecuteSQL($vSqlHistorial);

    $historialSubastas = [];

    if (is_array($historial) && !empty($historial)) {
        foreach ($historial as $sub) {
            $historialSubastas[] = [
                "id_subasta"        => $sub->id_subasta,
                "fecha_inicio"      => $sub->fecha_inicio,
                "fecha_fin"         => $sub->fecha_fin,
                "precio_inicial"    => $sub->precio_inicial,
                "incremento_minimo" => $sub->incremento_minimo,
                "estado_subasta"    => $sub->estado_subasta,
                "cantidad_pujas"    => $sub->cantidad_pujas
            ];
        }
    }

    /* RESULTADO FINAL */

    $relojFinal = [
        "id_reloj"          => $reloj->id_reloj,
        "modelo"            => $reloj->modelo,
        "descripcion"       => $reloj->descripcion,
        "imagen"            => $reloj->imagen,
        "anio_fabricacion"  => $reloj->anio_fabricacion,
        "precio_estimado"   => $reloj->precio_estimado,
        "fecha_registro"    => $reloj->fecha_registro,

        "id_marca"          => $reloj->id_marca,
        "marca"             => $reloj->marca,

        "id_condicion"      => $reloj->id_condicion,
        "condicion"         => $reloj->condicion,

        "categorias"        => $listaCategorias,

        "estado"            => $reloj->estado,
        "estado_vendedor"   => $reloj->estado_vendedor,

        "vendedor"          => $vendedor,
        "historial_subastas" => $historialSubastas
    ];

    return $relojFinal;
}

    /* Crear */
    public function create($obj)
    {
        /* 1 insertar reloj */

        $imagen = isset($obj->imagen) ? $obj->imagen : "";

        $sql = "INSERT INTO reloj
            (modelo, descripcion, imagen, anio_fabricacion, precio_estimado, id_marca, id_condicion)
            VALUES
            (
                '$obj->modelo',
                '$obj->descripcion',
                '$imagen',
                '$obj->anio_fabricacion',
                '$obj->precio_estimado',
                $obj->id_marca,
                $obj->id_condicion
            )";

        $idReloj = $this->enlace->executeSQL_DML_last($sql);

        /* 2 insertar categorias */

        if (!empty($obj->categorias)) {

            foreach ($obj->categorias as $categoria) {

                $sqlCat = "INSERT INTO reloj_categoria
                       (id_reloj,id_categoria)
                       VALUES ($idReloj,$categoria)";

                $this->enlace->executeSQL_DML($sqlCat);
            }
        }

        /* 3 asociar vendedor */

        $sqlVend = "INSERT INTO reloj_vendedor
                (id_reloj,id_usuario_vendedor,fecha_publicacion,id_estado_reloj_vendedor)
                VALUES
                ($idReloj,$obj->id_usuario,NOW(),1)";

        $this->enlace->executeSQL_DML($sqlVend);

        return $idReloj;
    }

    /* Actualizar */
    public function update($obj)
    {
        //  Obtener la imagen actual 
        $sqlImagenActual = "SELECT imagen FROM reloj WHERE id_reloj = $obj->id_reloj";
        $resultadoImg = $this->enlace->executeSQL($sqlImagenActual);
        $imagenFinal = !empty($resultadoImg) ? $resultadoImg[0]->imagen : "";

        //  Procesar nueva imagen
        if (isset($_FILES['imagen']) && $_FILES['imagen']['error'] === 0) {

            $nombreArchivo = $_FILES['imagen']['name']; 
            $rutaServidor = "uploads/" . $nombreArchivo;

            if (move_uploaded_file($_FILES['imagen']['tmp_name'], $rutaServidor)) {
                // simplemente se actualiza el nombre en BD

                $imagenFinal = $nombreArchivo; 
            }

        }

        // 3. Actualizar tabla reloj
        $sql = "UPDATE reloj SET
            modelo='$obj->modelo',
            descripcion='$obj->descripcion',
            imagen='$imagenFinal',
            anio_fabricacion='$obj->anio_fabricacion',
            precio_estimado='$obj->precio_estimado',
            id_marca=$obj->id_marca,
            id_condicion=$obj->id_condicion
            WHERE id_reloj=$obj->id_reloj";

        $this->enlace->executeSQL_DML($sql);

        // 4. Actualizar categorías (Limpiar e insertar)
        $this->enlace->executeSQL_DML("DELETE FROM reloj_categoria WHERE id_reloj=$obj->id_reloj");

        if (!empty($obj->categorias)) {
            foreach ($obj->categorias as $catId) {
                $sqlCat = "INSERT INTO reloj_categoria (id_reloj, id_categoria) VALUES ($obj->id_reloj, $catId)";
                $this->enlace->executeSQL_DML($sqlCat);
            }
        }

        return ["success" => true, "message" => "Reloj actualizado"];
    }

    /* Eliminar */
    public function delete($id)
    {
        $sql1 = "UPDATE reloj
             SET id_estado = 2
             WHERE id_reloj = $id";

        $this->enlace->executeSQL_DML($sql1);
    }

    public function tieneSubastaActiva($idReloj)
    {
        $sql = "SELECT s.id_subasta
            FROM reloj_vendedor rv
            INNER JOIN subasta s
            ON s.id_reloj_vendedor = rv.id_reloj_vendedor
            WHERE rv.id_reloj = $idReloj
            AND s.id_estado_subasta = 1";

        return $this->enlace->executeSQL($sql);
    }

    public function cambiarEstado($id)
    {
        $sql = "UPDATE reloj
            SET id_estado = CASE
                WHEN id_estado = 1 THEN 2  
                WHEN id_estado = 2 THEN 1  
                ELSE id_estado
            END
            WHERE id_reloj = $id";

        return $this->enlace->executeSQL_DML($sql);
    }
    /*Metodo de buscar el reloj por marca*/
    public function allByMarca($idMarca)
    {
        $vSql = "SELECT 
                r.*,
                m.nombre AS marca,
                c.nombre AS condicion,
                GROUP_CONCAT(cat.nombre SEPARATOR ', ') AS categorias
            FROM reloj r
            INNER JOIN marca m 
                ON r.id_marca = m.id_marca
            INNER JOIN condicion c 
                ON r.id_condicion = c.id_condicion
            LEFT JOIN reloj_categoria rc
                ON r.id_reloj = rc.id_reloj
            LEFT JOIN categoria cat
                ON rc.id_categoria = cat.id_categoria
            WHERE r.id_marca = $idMarca
            GROUP BY r.id_reloj;";

        return $this->enlace->ExecuteSQL($vSql);
    }
}
