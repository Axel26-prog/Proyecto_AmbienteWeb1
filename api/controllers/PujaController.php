<?php

use Pusher\Pusher;

class PujaController
{
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
        try {
            $model = new PujaModel();
            $pujas = $model->getBySubasta($idSubasta) ?? [];

            echo json_encode([
                "success" => true,
                "data" => $pujas
            ]);
        } catch (Exception $e) {
            $this->error(500, $e->getMessage());
        }
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
        try {
            $request = json_decode(file_get_contents("php://input"));

            if (
                !$request ||
                !isset($request->id_subasta) ||
                !isset($request->id_usuario) ||
                !isset($request->monto)
            ) {
                return $this->error(400, "Datos incompletos para registrar la puja");
            }

            $pujaModel = new PujaModel();
            $subastaModel = new SubastaModel();
            $usuarioModel = new UsuarioModel();

            $subasta = $subastaModel->get($request->id_subasta);

            if (!$subasta) {
                return $this->error(404, "Subasta no encontrada");
            }

            $usuario = $usuarioModel->get($request->id_usuario);

            if (!$usuario) {
                return $this->error(404, "Usuario no encontrado");
            }

            // validar rol cliente
            if (strtolower($usuario->rol) !== "cliente") {
                return $this->error(403, "Solo los usuarios con rol cliente pueden realizar pujas");
            }

            if (strtolower($subasta->estado) !== "activa") {
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

            if ((int)$subasta->id_usuario === (int)$request->id_usuario) {
                return $this->error(400, "El vendedor no puede pujar en su propia subasta");
            }

            $pujaMasAlta = $pujaModel->getPujaMasAlta($request->id_subasta);

            /* 
Validar auto-puja:
Si ya existe una puja más alta y pertenece al mismo usuario,
no se le permite volver a pujar hasta que otro comprador lo supere.
*/
            if ($pujaMasAlta && (int)$pujaMasAlta->id_usuario === (int)$request->id_usuario) {
                return $this->error(
                    400,
                    "No puede realizar otra puja consecutiva. Debe esperar a que otro comprador supere su oferta."
                );
            }

            $montoActual = $pujaMasAlta ? (float)$pujaMasAlta->monto : (float)$subasta->precio_inicial;
            $montoNuevo = (float)$request->monto;
            $incrementoMinimo = (float)$subasta->incremento_minimo;

            if ($montoNuevo <= $montoActual) {
                return $this->error(
                    400,
                    "El monto debe ser mayor a la puja actual: $" . number_format($montoActual, 2)
                );
            }

            $minimo = $montoActual + $incrementoMinimo;

            if ($montoNuevo < $minimo) {
                return $this->error(
                    400,
                    "El monto mínimo requerido es: $" . number_format($minimo, 2)
                );
            }

            $pujaModel->create($request);

            $fechaHora = date("Y-m-d H:i:s");
            $nombreUsuario = isset($request->nombre_usuario) && trim($request->nombre_usuario) !== ""
                ? $request->nombre_usuario
                : "Usuario";

            $this->getPusher()->trigger(
                "subasta-{$request->id_subasta}",
                "nueva-puja",
                [
                    "monto" => $montoNuevo,
                    "usuario" => $nombreUsuario,
                    "id_usuario" => (int)$request->id_usuario,
                    "fecha_hora" => $fechaHora
                ]
            );

            echo json_encode([
                "success" => true,
                "message" => "Puja registrada correctamente",
                "data" => [
                    "id_subasta" => (int)$request->id_subasta,
                    "id_usuario" => (int)$request->id_usuario,
                    "usuario" => $nombreUsuario,
                    "monto" => $montoNuevo,
                    "fecha_hora" => $fechaHora
                ]
            ]);
        } catch (Exception $e) {
            return $this->error(500, $e->getMessage());
        }
    }

    private function cerrarSubastaYDeterminarGanador($idSubasta, $subastaModel, $pujaModel)
    {
        $subastaModel->cerrarSubasta($idSubasta);

        $ganadorModel = new GanadorModel();

        if ($ganadorModel->existeGanador($idSubasta)) {
            return;
        }

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
            $pago->monto = $pujaMasAlta->monto;
            $pago->fecha_pago = date("Y-m-d H:i:s");
            $pago->id_ganador = $idGanador;
            $pago->id_estado_pago = 1; // pendiente
            $pago->id_metodo_pago = 1;

            $pagoModel->create($pago);

            $pusher->trigger(
                "subasta-{$idSubasta}",
                "subasta-cerrada",
                [
                    "ganador" => (int)$pujaMasAlta->id_usuario,
                    "usuario" => $pujaMasAlta->usuario ?? null,
                    "monto_final" => (float)$pujaMasAlta->monto
                ]
            );
        } else {
            $pusher->trigger(
                "subasta-{$idSubasta}",
                "subasta-cerrada",
                [
                    "ganador" => null,
                    "usuario" => null,
                    "monto_final" => null
                ]
            );
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
