<?php
class PujaController
{
    public function index()
    {
        try {

            $response = new Response();

            $model = new PujaModel();

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

            $model = new PujaModel();

            $result = $model->get($param);

            $response->toJSON($result);

        } catch (Exception $e) {

            handleException($e);

        }
    }

       public function getBySubasta($idSubasta) {
        $model = new PujaModel();
        $pujas = $model->getBySubasta($idSubasta);

        
        if (!$pujas) {
            $pujas = [];
        }

        echo json_encode([
            "success" => true,
            "data" => $pujas
        ]);
    }


    public function getPujaMasAlta($param)
    {
        try {

            $response = new Response();

            $model = new PujaModel();

            $result = $model->getPujaMasAlta($param);

            $response->toJSON($result);

        } catch (Exception $e) {

            handleException($e);

        }
    }
}