<?php
class SubastaController
{
    public function index()
    {
        try {
            $model = new SubastaModel();
            $result = $model->all();
            echo json_encode($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function get($id)
    {
        try {
            $model = new SubastaModel();
            $result = $model->get($id);
            echo json_encode($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function create()
    {
        try {
            $request = json_decode(file_get_contents("php://input"));
            $model = new SubastaModel();

            /* Validar que el reloj_vendedor no tenga subasta activa */
            if ($model->tieneSubastaActiva($request->id_reloj_vendedor)) {
                http_response_code(409);
                echo json_encode([
                    "success" => false,
                    "message" => "Este objeto ya tiene una subasta activa"
                ]);
                return;
            }

            $result = $model->create($request);
            echo json_encode(["success" => true, "id_subasta" => $result]);

        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function update()
    {
        try {
            $request = json_decode(file_get_contents("php://input"));
            $model = new SubastaModel();
            $result = $model->update($request);
            echo json_encode(["success" => true]);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    /* PUT /subasta/cancelar/{id} */
    public function cancelar($id)
    {
        try {
            $model = new SubastaModel();

            /* Obtener subasta para validar */
            $subasta = $model->get($id);

            if (!$subasta) {
                http_response_code(404);
                echo json_encode(["success" => false, "message" => "Subasta no encontrada"]);
                return;
            }

            /* Solo se puede cancelar si no ha iniciado O no tiene pujas */
            $ahora = new DateTime();
            $fechaInicio = new DateTime($subasta->fecha_inicio);
            $yaInicio = $ahora >= $fechaInicio;

            if ($yaInicio && $subasta->total_pujas > 0) {
                http_response_code(403);
                echo json_encode([
                    "success" => false,
                    "message" => "No se puede cancelar: la subasta ya inició y tiene pujas"
                ]);
                return;
            }

            $model->cancelar($id);
            echo json_encode(["success" => true, "message" => "Subasta cancelada"]);

        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function delete($id)
    {
        try {
            $model = new SubastaModel();
            $result = $model->delete($id);
            echo json_encode($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function activas()
    {
        try {
            $model = new SubastaModel();
            $result = $model->getActivas();
            echo json_encode($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function finalizadas()
    {
        try {
            $model = new SubastaModel();
            $result = $model->getFinalizadas();
            echo json_encode($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function detalle($id)
    {
        try {
            $model = new SubastaModel();
            $result = $model->getDetalleSubasta($id);
            echo json_encode($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}