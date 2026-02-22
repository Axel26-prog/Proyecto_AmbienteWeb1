<?php
class puja
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

    public function getBySubasta($param)
    {
        try {

            $response = new Response();

            $model = new PujaModel();

            $result = $model->getBySubasta($param);

            $response->toJSON($result);

        } catch (Exception $e) {

            handleException($e);

        }
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