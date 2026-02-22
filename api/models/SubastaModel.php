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
        $vSql = "SELECT s.id_subasta,
                        s.fecha_inicio,
                        s.fecha_fin,
                        s.precio_inicial,
                        s.incremento_minimo,
                        rv.id_reloj_vendedor,
                        r.modelo,
                        es.nombre AS estado
                 FROM subasta s
                 INNER JOIN reloj_vendedor rv
                    ON s.id_reloj_vendedor = rv.id_reloj_vendedor
                 INNER JOIN reloj r
                    ON rv.id_reloj = r.id_reloj
                 INNER JOIN estado_subasta es
                    ON s.id_estado_subasta = es.id_estado_subasta;";

        return $this->enlace->ExecuteSQL($vSql);
    }

    /* Obtener subasta por ID */
    public function get($id)
    {
        $vSql = "SELECT s.id_subasta,
                        s.fecha_inicio,
                        s.fecha_fin,
                        s.precio_inicial,
                        s.incremento_minimo,
                        rv.id_reloj_vendedor,
                        r.modelo,
                        es.nombre AS estado
                 FROM subasta s
                 INNER JOIN reloj_vendedor rv
                    ON s.id_reloj_vendedor = rv.id_reloj_vendedor
                 INNER JOIN reloj r
                    ON rv.id_reloj = r.id_reloj
                 INNER JOIN estado_subasta es
                    ON s.id_estado_subasta = es.id_estado_subasta
                 WHERE s.id_subasta=$id;";

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

        return $this->enlace->ExecuteSQL($vSql);
    }

    /* Actualizar subasta */
    public function update($obj)
    {
        $vSql = "UPDATE subasta SET
                    fecha_inicio='$obj->fecha_inicio',
                    fecha_fin='$obj->fecha_fin',
                    precio_inicial=$obj->precio_inicial,
                    incremento_minimo=$obj->incremento_minimo,
                    id_reloj_vendedor=$obj->id_reloj_vendedor,
                    id_estado_subasta=$obj->id_estado_subasta
                 WHERE id_subasta=$obj->id_subasta;";

        return $this->enlace->ExecuteSQL($vSql);
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
        $vSql = "SELECT s.*,
                        r.modelo,
                        es.nombre AS estado
                 FROM subasta s
                 INNER JOIN reloj_vendedor rv
                    ON s.id_reloj_vendedor = rv.id_reloj_vendedor
                 INNER JOIN reloj r
                    ON rv.id_reloj = r.id_reloj
                 INNER JOIN estado_subasta es
                    ON s.id_estado_subasta = es.id_estado_subasta
                 WHERE es.nombre='activa';";

        return $this->enlace->ExecuteSQL($vSql);
    }
}