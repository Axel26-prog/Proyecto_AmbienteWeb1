<?php
class UsuarioController
{
    public function index()
    {
        try {
            $response = new Response();

            $model = new UsuarioModel();

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

            $model = new UsuarioModel();

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

            $model = new UsuarioModel();

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

            $model = new UsuarioModel();

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
            $model = new UsuarioModel();

            $result = $model->delete($id);

            $response = new Response();

            $response->toJSON($result);

        } catch (Exception $e) {

            handleException($e);
        }
    }

    public function login()
    {
        try {
            $request = json_decode(file_get_contents("php://input"));

            $model = new UsuarioModel();

            $result = $model->login(
                $request->correo,
                $request->contrasena
            );

            $response = new Response();

            $response->toJSON($result);

        } catch (Exception $e) {

            handleException($e);
        }
    }

    public function detalle($id)
{
    try {
        $response = new Response();

        $model = new UsuarioModel();

        $result = $model->getDetalle($id);

        $response->toJSON($result);

    } catch (Exception $e) {

        handleException($e);
    }
}
}