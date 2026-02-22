<?php
class RelojController
{
    public function index()
    {
        $model = new RelojModel();

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