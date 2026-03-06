<?php
class SubastaController
{
    public function index()
    {
        try {

            $response = new Response();

            $model = new SubastaModel();

            $result = $model->all();

            $response->toJSON($result);

        } catch (Exception $e) {

            handleException($e);

        }
    }

    public function get($id)
    {
        try {

            $response = new Response();

            $model = new SubastaModel();

            $result = $model->get($id);

            $response->toJSON($result);

        } catch (Exception $e) {

            handleException($e);

        }
    }

    public function create()
    {
        try {

            $request = json_decode(file_get_contents("php://input"));

            $model = new SubastaModel();

            $result = $model->create($request);

            $response = new Response();

            $response->toJSON($result);

        } catch (Exception $e) {

            handleException($e);

        }
    }

    public function update()
    {
        try {

            $request = json_decode(file_get_contents("php://input"));

            $model = new SubastaModel();

            $result = $model->update($request);

            $response = new Response();

            $response->toJSON($result);

        } catch (Exception $e) {

            handleException($e);

        }
    }

    public function delete($id)
    {
        try {

            $model = new SubastaModel();

            $result = $model->delete($id);

            $response = new Response();

            $response->toJSON($result);

        } catch (Exception $e) {

            handleException($e);

        }
    }

    public function activas()
    {
        try {

            $response = new Response();

            $model = new SubastaModel();

            $result = $model->getActivas();

            $response->toJSON($result);

        } catch (Exception $e) {

            handleException($e);

        }
    }

    public function finalizadas()
{
    try {

        $response = new Response();

        $model = new SubastaModel();

        $result = $model->getFinalizadas();

        $response->toJSON($result);

    } catch (Exception $e) {

        handleException($e);

    }
}

public function detalle($id)
{
    try {
        $response = new Response();
        $model = new SubastaModel();
        $result = $model->getDetalleSubasta($id);
        $response->toJSON($result);
    } catch (Exception $e) {
        handleException($e);
    }
}
}