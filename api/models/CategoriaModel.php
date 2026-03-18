<?php
class CategoriaModel
{
    public $enlace;

    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }

    public function all()
    {
        $sql = "SELECT * FROM categoria";
        return $this->enlace->ExecuteSQL($sql);
    }
}