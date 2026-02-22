<?php
class MarcaController
{
    public function index()
    {
        try {

            $response = new Response();

            $model = new MarcaModel();

            $result = $model->all();

            $response->toJSON($result);

        } catch (Exception $e) {

            handleException($e);

        }
    }

    public function get($param)
    {
        try {

            $response = new Response();

            $model = new MarcaModel();

            $result = $model->get($param);

            $response->toJSON($result);

        } catch (Exception $e) {

            handleException($e);

        }
    }
}