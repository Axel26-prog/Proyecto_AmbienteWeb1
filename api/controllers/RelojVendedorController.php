<?php
class RelojVendedorController
{
    /* GET /relojvendedor/byReloj/{id_reloj} */
    public function byReloj($idReloj)
    {
        try {
            $model = new RelojVendedorModel();
            $result = $model->getByReloj($idReloj);

            if (!$result) {
                http_response_code(404);
                echo json_encode([
                    "success" => false,
                    "message" => "No se encontró reloj_vendedor para este reloj"
                ]);
                return;
            }

            echo json_encode($result);

        } catch (Exception $e) {
            handleException($e);
        }
    }
}