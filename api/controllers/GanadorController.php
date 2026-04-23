<?php
class GanadorController
{
    public function getBySubasta($idSubasta)
    {
        try {
            $model = new GanadorModel();
            $result = $model->getBySubasta($idSubasta);
            echo json_encode($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}