<?php
class RelojController
{
    public function index()
    {
        $model = new RelojModel();

        //si se selecciona una marca
        if (isset($_GET["marca"])) 
        {
            $idMarca = intval($_GET["marca"]);
            $response = $model->allByMarca($idMarca);
            echo json_encode($response);
            return;
        }
        //si no trae a todos
        $response = $model->all();

        echo json_encode($response);
    }

    public function get($id)
    {
        $model = new RelojModel();

        $response = $model->get($id);

        echo json_encode($response);
    }

    public function create()
    {
        $request = json_decode(file_get_contents("php://input"));

        $model = new RelojModel();

        $response = $model->create($request);

        echo json_encode($response);
    }

    public function update()
    {
        $request = json_decode(file_get_contents("php://input"));

        $model = new RelojModel();

        $response = $model->update($request);

        echo json_encode($response);
    }

    public function delete($id)
    {
        $model = new RelojModel();

        $response = $model->delete($id);

        echo json_encode($response);
    }
}