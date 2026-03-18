<?php

class CategoriaController
{
    public function index()
    {
        $model = new CategoriaModel();
        $data = $model->all();

        echo json_encode([
            "status" => true,
            "data" => $data
        ]);
    }
}