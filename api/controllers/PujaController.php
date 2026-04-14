<?php
require_once __DIR__ . '/../../api/vendor/autoload.php';

use Pusher\Pusher;

class PujaController
{
    private function getPusher()
    {
        return new Pusher(
            'f286856de296137ede61',
            'dbf92c79617f65f2affb',
            '2139427',
            ['cluster' => 'us2', 'useTLS' => true]
        );
    }

    public function index()
    {
        try {
            $model = new PujaModel();
            echo json_encode($model->all());
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function get($param)
    {
        try {
            $model = new PujaModel();
            echo json_encode($model->get($param));
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function getBySubasta($idSubasta)
    {
        $model = new PujaModel();
        $pujas = $model->getBySubasta($idSubasta) ?? [];

        echo json_encode([
            "success" => true,
            "data" => $pujas
        ]);
    }

    public function getPujaMasAlta($param)
    {
        try {
            $model = new PujaModel();
            echo json_encode($model->getPujaMasAlta($param));
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function create()
    {
        error_reporting(E_ALL);
        ini_set('display_errors', 1);

        try {
            $request = json_decode(file_get_contents("php://input"));

            $pujaModel    = new PujaModel();
            $subastaModel = new SubastaModel();

            $subasta = $subastaModel->get($request->id_subasta);

            if (!$subasta) {
                return $this->error(404, "Subasta no encontrada");
            }

            if (strtolower($subasta->estado) !== 'activa') {
                return $this->error(400, "La subasta no está activa");
            }

            if (new DateTime() >= new DateTime($subasta->fecha_fin)) {
                $this->cerrarSubastaYDeterminarGanador(
                    $request->id_subasta,
                    $subastaModel,
                    $pujaModel
                );
                return $this->error(400, "La subasta ya cerró");
            }

            if ($subasta->id_usuario == $request->id_usuario) {
                return $this->error(400, "El vendedor no puede pujar en su propia subasta");
            }

            $pujaMasAlta = $pujaModel->getPujaMasAlta($request->id_subasta);
            $montoActual = $pujaMasAlta ? $pujaMasAlta->monto : $subasta->precio_inicial;

            if ($request->monto <= $montoActual) {
                return $this->error(
                    400,
                    "El monto debe ser mayor a la puja actual: $" . number_format($montoActual, 2)
                );
            }

            $minimo = $montoActual + $subasta->incremento_minimo;

            if ($request->monto < $minimo) {
                return $this->error(
                    400,
                    "El monto mínimo requerido es: $" . number_format($minimo, 2)
                );
            }

            $pujaModel->create($request);

            $this->getPusher()->trigger(
                "subasta-{$request->id_subasta}",
                "nueva-puja",
                [
                    "monto"      => $request->monto,
                    "usuario"    => $request->nombre_usuario ?? "Usuario",
                    "id_usuario" => $request->id_usuario,
                    "fecha_hora" => date("Y-m-d H:i:s"),
                ]
            );

            echo json_encode([
                "success" => true,
                "message" => "Puja registrada correctamente"
            ]);

        } catch (Exception $e) {
            $this->error(500, $e->getMessage());
        }
    }

    private function cerrarSubastaYDeterminarGanador($idSubasta, $subastaModel, $pujaModel)
    {
        $subastaModel->cerrarSubasta($idSubasta);

        $ganadorModel = new GanadorModel();

        if ($ganadorModel->existeGanador($idSubasta)) return;

        $pujaMasAlta = $pujaModel->getPujaMasAlta($idSubasta);
        $pusher = $this->getPusher();

        if ($pujaMasAlta) {
            $idGanador = $ganadorModel->create(
                $idSubasta,
                $pujaMasAlta->id_usuario,
                $pujaMasAlta->monto
            );

            $pagoModel = new PagoModel();
            $pago = new stdClass();

            $pago->monto          = $pujaMasAlta->monto;
            $pago->fecha_pago     = date("Y-m-d H:i:s");
            $pago->id_ganador     = $idGanador;
            $pago->id_estado_pago = 1;
            $pago->id_metodo_pago = 1;

            $pagoModel->create($pago);

            $pusher->trigger("subasta-{$idSubasta}", "subasta-cerrada", [
                "ganador"     => $pujaMasAlta->id_usuario,
                "monto_final" => $pujaMasAlta->monto,
            ]);

        } else {
            $pusher->trigger("subasta-{$idSubasta}", "subasta-cerrada", [
                "ganador"     => null,
                "monto_final" => null,
            ]);
        }
    }

    private function error($code, $message)
    {
        http_response_code($code);
        echo json_encode([
            "success" => false,
            "message" => $message
        ]);
        return;
    }
}