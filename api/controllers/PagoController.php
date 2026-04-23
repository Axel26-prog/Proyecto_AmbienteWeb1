<?php

use Pusher\Pusher;

class PagoController
{
    private $model;

    public function __construct()
    {
        $this->model = new PagoModel();
    }

    private function getPusher()
    {
        return new Pusher(
            'f286856de296137ede61',
            'dbf92c79617f65f2affb',
            '2139427',
            [
                'cluster' => 'us2',
                'useTLS' => true
            ]
        );
    }

    /* Listar todos */
    public function index()
    {
        $response = $this->model->all();
        echo json_encode($response);
    }

    /* Obtener uno */
    public function get($id)
    {
        $response = $this->model->get($id);
        echo json_encode($response);
    }

    /* Obtener por ganador */
    public function getByGanador($idGanador)
    {
        $response = $this->model->getByGanador($idGanador);
        echo json_encode($response);
    }

    /* Crear */
    public function create()
    {
        $request = json_decode(file_get_contents("php://input"));

        $response = $this->model->create($request);

        echo json_encode([
            "success" => $response
        ]);
    }

    /* Actualizar */
    public function update()
    {
        $request = json_decode(file_get_contents("php://input"));
        $response = $this->model->update($request);

        if ($response) {
            $ganadorModel = new GanadorModel();
            $ganador = $ganadorModel->get($request->id_ganador); // agrega este método si no existe

            if ($ganador) {
                $this->getPusher()->trigger(
                    "subasta-{$ganador->id_subasta}",
                    "pago-confirmado",
                    [
                        "id_pago" => (int)$request->id_pago,
                        "id_usuario" => (int)$ganador->id_usuario,
                        "id_subasta" => (int)$ganador->id_subasta,
                        "fecha_pago" => date("Y-m-d H:i:s")
                    ]
                );
            }
        }

        echo json_encode([
            "success" => $response
        ]);
    }

    /* Eliminar */
    public function delete($id)
    {
        $response = $this->model->delete($id);

        echo json_encode([
            "success" => $response
        ]);
    }

    public function getByUsuario($idUsuario)
    {
        $response = $this->model->getByUsuario($idUsuario);
        echo json_encode($response);
    }
}
