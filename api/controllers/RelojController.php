<?php
class RelojController
{
    public function index()
    {
        $model = new RelojModel();

        if (isset($_GET["marca"])) {
            $idMarca = intval($_GET["marca"]);
            $response = $model->allByMarca($idMarca);
            echo json_encode($response);
            return;
        }

        $response = $model->all();
        echo json_encode($response);
    }

    public function get($id)
    {
        $model = new RelojModel();
        $response = $model->get($id);
        echo json_encode($response);
    }

    public function create()
    {
        $model = new RelojModel();

        // Recibe FormData (para soportar upload de imagen)
        $request = (object) $_POST;

        // Decodificar categorías (vienen como JSON string desde FormData)
        if (isset($request->categorias) && is_string($request->categorias)) {
            $request->categorias = json_decode($request->categorias);
        }

        // id_usuario provisional (se reemplazará con JWT)
        if (!isset($request->id_usuario)) {
            $request->id_usuario = 2;
        }

        // Procesar imagen si se envió
        $request->imagen = "";
        if (isset($_FILES['imagen']) && $_FILES['imagen']['error'] === 0) {
            $nombreArchivo = $_FILES['imagen']['name'];
            $rutaServidor  = "uploads/" . $nombreArchivo;

            if (move_uploaded_file($_FILES['imagen']['tmp_name'], $rutaServidor)) {
                $request->imagen = $nombreArchivo;
            }
        }

        $response = $model->create($request);
        echo json_encode($response);
    }

    public function update()
    {
        $model = new RelojModel();

        if (!empty($_POST)) {
            $request = (object) $_POST;

            if (isset($request->categorias) && is_string($request->categorias)) {
                $request->categorias = json_decode($request->categorias);
            }
        } else {
            $request = json_decode(file_get_contents("php://input"));
        }

        if (!$request || !isset($request->id_reloj)) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Datos insuficientes"]);
            return;
        }

        $response = $model->update($request);
        echo json_encode($response);
    }

    public function delete($id)
    {
        $model = new RelojModel();
        $response = $model->delete($id);
        echo json_encode($response);
    }

    public function toggle($id)
    {
        $model = new RelojModel();
        $response = $model->cambiarEstado($id);
        echo json_encode($response);
    }
}