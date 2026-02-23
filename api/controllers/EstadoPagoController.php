<?php
class EstadoPagoController
{
    /* Listar todos */
    public function index()
    {
        try {
            $response = new Response();

            $model = new EstadoPagoModel();
            $result = $model->all();

            $response->toJSON($result);

        } catch (Exception $e) {
            handleException($e);
        }
    }

    /* Obtener uno */
    public function get($id)
    {
        try {
            $response = new Response();

            $model = new EstadoPagoModel();
            $result = $model->get($id);

            $response->toJSON($result);

        } catch (Exception $e) {
            handleException($e);
        }
    }

    /* Crear */
    public function create()
    {
        try {
            $request = json_decode(file_get_contents("php://input"));

            $response = new Response();

            $model = new EstadoPagoModel();
            $result = $model->create($request);

            $response->toJSON($result);

        } catch (Exception $e) {
            handleException($e);
        }
    }

    /* Actualizar */
    public function update()
    {
        try {
            $request = json_decode(file_get_contents("php://input"));

            $response = new Response();

            $model = new EstadoPagoModel();
            $result = $model->update($request);

            $response->toJSON($result);

        } catch (Exception $e) {
            handleException($e);
        }
    }

    /* Eliminar */
    public function delete($id)
    {
        try {
            $response = new Response();

            $model = new EstadoPagoModel();
            $result = $model->delete($id);

            $response->toJSON($result);

        } catch (Exception $e) {
            handleException($e);
        }
    }
}