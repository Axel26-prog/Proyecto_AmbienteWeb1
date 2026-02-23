<?php
class RolController
{
    public function index()
    {
        try {
            $response = new Response();

            $model = new RolModel();

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

            $model = new RolModel();

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

            $model = new RolModel();

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

            $model = new RolModel();

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
            $model = new RolModel();

            $result = $model->delete($id);

            $response = new Response();

            $response->toJSON($result);

        } catch (Exception $e) {

            handleException($e);
        }
    }
}