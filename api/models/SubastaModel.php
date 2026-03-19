<?php
class SubastaModel
{
    public $enlace;

    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }

    /* Listar todas las subastas */
    public function all()
    {
        $vSql = "SELECT 
                    s.id_subasta,
                    s.fecha_inicio,
                    s.fecha_fin,
                    s.precio_inicial,
                    s.incremento_minimo,
                    r.modelo,
                    r.imagen,
                    es.nombre AS estado,
                    GROUP_CONCAT(DISTINCT cat.nombre SEPARATOR ', ') AS categorias,
                    COUNT(DISTINCT p.id_puja) AS cantidad_pujas
                FROM subasta s
                INNER JOIN reloj_vendedor rv
                    ON s.id_reloj_vendedor = rv.id_reloj_vendedor
                INNER JOIN reloj r
                    ON rv.id_reloj = r.id_reloj
                LEFT JOIN reloj_categoria rc
                    ON r.id_reloj = rc.id_reloj
                LEFT JOIN categoria cat
                    ON rc.id_categoria = cat.id_categoria
                INNER JOIN estado_subasta es
                    ON s.id_estado_subasta = es.id_estado_subasta
                LEFT JOIN puja p
                    ON p.id_subasta = s.id_subasta
                GROUP BY s.id_subasta;";

        return $this->enlace->ExecuteSQL($vSql);
    }

    /* Obtener subasta por ID */
    public function get($id)
    {
        $vSql = "SELECT 
                    s.id_subasta,
                    s.id_reloj_vendedor,
                    r.modelo,
                    r.descripcion,
                    r.imagen,
                    m.nombre AS marca,
                    c.nombre AS condicion,
                    GROUP_CONCAT(DISTINCT cat.nombre SEPARATOR ', ') AS categorias,
                    s.fecha_inicio,
                    s.fecha_fin,
                    s.precio_inicial,
                    s.incremento_minimo,
                    es.nombre AS estado,
                    es.id_estado_subasta,
                    COUNT(DISTINCT p.id_puja) AS total_pujas,
                    u.id_usuario,
                    u.nombre AS nombre_vendedor,
                    u.apellido AS apellido_vendedor
                FROM subasta s
                INNER JOIN reloj_vendedor rv
                    ON s.id_reloj_vendedor = rv.id_reloj_vendedor   
                INNER JOIN reloj r
                    ON rv.id_reloj = r.id_reloj
                INNER JOIN marca m
                    ON r.id_marca = m.id_marca
                INNER JOIN condicion c
                    ON r.id_condicion = c.id_condicion
                LEFT JOIN reloj_categoria rc
                    ON r.id_reloj = rc.id_reloj
                LEFT JOIN categoria cat
                    ON rc.id_categoria = cat.id_categoria
                INNER JOIN estado_subasta es
                    ON s.id_estado_subasta = es.id_estado_subasta
                LEFT JOIN puja p
                    ON p.id_subasta = s.id_subasta
                LEFT JOIN usuario u
                    ON rv.id_usuario_vendedor = u.id_usuario
                WHERE s.id_subasta = $id
                GROUP BY s.id_subasta;";

        $vResultado = $this->enlace->ExecuteSQL($vSql);

        return $vResultado[0];
    }

    /* Crear subasta */
    public function create($obj)
    {
        $vSql = "INSERT INTO subasta
                    (
                        fecha_inicio,
                        fecha_fin,
                        precio_inicial,
                        incremento_minimo,
                        id_reloj_vendedor,
                        id_estado_subasta
                    )
                 VALUES
                    (
                        '$obj->fecha_inicio',
                        '$obj->fecha_fin',
                        $obj->precio_inicial,
                        $obj->incremento_minimo,
                        $obj->id_reloj_vendedor,
                        $obj->id_estado_subasta
                    );";

        return $this->enlace->executeSQL_DML_last($vSql);
    }

    /* Actualizar subasta */
    public function update($obj)
    {
        $vSql = "UPDATE subasta SET
                    fecha_inicio='$obj->fecha_inicio',
                    fecha_fin='$obj->fecha_fin',
                    precio_inicial=$obj->precio_inicial,
                    incremento_minimo=$obj->incremento_minimo
                 WHERE id_subasta=$obj->id_subasta;";

        return $this->enlace->executeSQL_DML($vSql);
    }

    
    public function cancelar($id)
    {
        $vSql = "UPDATE subasta
                 SET id_estado_subasta = 3
                 WHERE id_subasta = $id;";

        return $this->enlace->executeSQL_DML($vSql);
    }

    /* Eliminar subasta */
    public function delete($id)
    {
        $vSql = "DELETE FROM subasta
                 WHERE id_subasta=$id;";

        return $this->enlace->ExecuteSQL($vSql);
    }

    /* Obtener subastas activas */
    public function getActivas()
    {
        $this->cerrarSubastasVencidas();

        $vSql = "SELECT 
                    s.id_subasta,
                    r.modelo,
                    r.imagen,
                    GROUP_CONCAT(DISTINCT cat.nombre SEPARATOR ', ') AS categorias,
                    s.fecha_inicio,
                    s.fecha_fin AS fecha_estimada_cierre,
                    s.precio_inicial,
                    s.incremento_minimo,
                    COUNT(DISTINCT p.id_puja) AS cantidad_pujas
                FROM subasta s
                INNER JOIN reloj_vendedor rv
                    ON s.id_reloj_vendedor = rv.id_reloj_vendedor
                INNER JOIN reloj r
                    ON rv.id_reloj = r.id_reloj
                LEFT JOIN reloj_categoria rc
                    ON r.id_reloj = rc.id_reloj
                LEFT JOIN categoria cat
                    ON rc.id_categoria = cat.id_categoria
                INNER JOIN estado_subasta es
                    ON s.id_estado_subasta = es.id_estado_subasta
                LEFT JOIN puja p
                    ON p.id_subasta = s.id_subasta
                WHERE es.nombre = 'activa'
                GROUP BY s.id_subasta
                ORDER BY s.fecha_fin ASC;";

        return $this->enlace->ExecuteSQL($vSql);
    }

    /* Obtener subastas finalizadas */
    public function getFinalizadas()
    {
        $vSql = "SELECT 
                    s.id_subasta,
                    r.modelo,
                    r.imagen,
                    GROUP_CONCAT(DISTINCT cat.nombre SEPARATOR ', ') AS categorias,
                    s.fecha_fin AS fecha_cierre,
                    es.nombre AS estado_final,
                    COUNT(DISTINCT p.id_puja) AS cantidad_pujas
                FROM subasta s
                INNER JOIN reloj_vendedor rv
                    ON s.id_reloj_vendedor = rv.id_reloj_vendedor
                INNER JOIN reloj r
                    ON rv.id_reloj = r.id_reloj
                LEFT JOIN reloj_categoria rc
                    ON r.id_reloj = rc.id_reloj
                LEFT JOIN categoria cat
                    ON rc.id_categoria = cat.id_categoria
                INNER JOIN estado_subasta es
                    ON s.id_estado_subasta = es.id_estado_subasta
                LEFT JOIN puja p
                    ON p.id_subasta = s.id_subasta
                WHERE es.nombre IN ('cerrada','cancelada')
                GROUP BY s.id_subasta;";

        return $this->enlace->ExecuteSQL($vSql);
    }

    /* Obtener detalle completo de una subasta */
    public function getDetalleSubasta($id)
    {
        $vSql = "SELECT 
                    s.id_subasta,
                    r.modelo,
                    r.descripcion,
                    r.imagen,
                    s.fecha_inicio,
                    s.fecha_fin,
                    s.precio_inicial,
                    s.incremento_minimo,
                    es.nombre AS estado,
                    COUNT(DISTINCT p.id_puja) AS total_pujas
                FROM subasta s
                INNER JOIN reloj_vendedor rv
                    ON s.id_reloj_vendedor = rv.id_reloj_vendedor   
                INNER JOIN reloj r
                    ON rv.id_reloj = r.id_reloj
                INNER JOIN estado_subasta es
                    ON s.id_estado_subasta = es.id_estado_subasta
                LEFT JOIN puja p
                    ON p.id_subasta = s.id_subasta
                WHERE s.id_subasta = $id
                GROUP BY s.id_subasta;";

        $vResultado = $this->enlace->ExecuteSQL($vSql);

        return $vResultado[0];
    }

    public function cerrarSubastasVencidas()
    {
        $vSql = "UPDATE subasta
                SET id_estado_subasta = 2
                WHERE fecha_fin <= NOW()
                AND id_estado_subasta = 1;";

        return $this->enlace->executeSQL_DML($vSql);
    }

    /* Verificar si un reloj ya tiene subasta activa */
    public function tieneSubastaActiva($idRelojVendedor)
    {
        $vSql = "SELECT COUNT(*) AS total
                 FROM subasta
                 WHERE id_reloj_vendedor = $idRelojVendedor
                 AND id_estado_subasta = 1;";

        $resultado = $this->enlace->ExecuteSQL($vSql);

        return $resultado[0]->total > 0;
    }
}