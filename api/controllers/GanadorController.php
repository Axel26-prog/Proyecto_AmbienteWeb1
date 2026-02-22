<?php
class ganador
{
    public function index()
    {
        try {

            $response = new Response();

            $model = new GanadorModel();

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

            $model = new GanadorModel();

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

            $model = new GanadorModel();

            $result = $model->getBySubasta($param);

            $response->toJSON($result);

        } catch (Exception $e) {

            handleException($e);

        }
    }
}