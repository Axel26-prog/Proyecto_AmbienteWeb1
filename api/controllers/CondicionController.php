<?php
class CondicionController
{
    public function index()
    {
        try {

            $response = new Response();

            $model = new CondicionModel();

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

            $model = new CondicionModel();

            $result = $model->get($param);

            $response->toJSON($result);

        } catch (Exception $e) {

            handleException($e);

        }
    }
}