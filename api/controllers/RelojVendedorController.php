<?php
class RelojVendedorController
{
    private $model;

    public function __construct()
    {
        $this->model = new RelojVendedorModel();
    }

    /* Listar todos */
    public function index()
    {
        $response = $this->model->all();
        echo json_encode($response);
    }

    /* Obtener uno */
    public function get($id)
    {
        $response = $this->model->get($id);
        echo json_encode($response);
    }

    /* Obtener por vendedor */
    public function getByVendedor($idUsuario)
    {
        $response = $this->model->getByVendedor($idUsuario);
        echo json_encode($response);
    }

    /* Crear */
    public function create()
    {
        $request = json_decode(file_get_contents("php://input"));

        $response = $this->model->create($request);

        echo json_encode([
            "success" => $response
        ]);
    }

    /* Actualizar */
    public function update()
    {
        $request = json_decode(file_get_contents("php://input"));

        $response = $this->model->update($request);

        echo json_encode([
            "success" => $response
        ]);
    }

    /* Eliminar */
    public function delete($id)
    {
        $response = $this->model->delete($id);

        echo json_encode([
            "success" => $response
        ]);
    }
}