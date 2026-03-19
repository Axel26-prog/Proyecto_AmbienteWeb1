<?php
class RelojController
{
    public function index()
    {
        $model = new RelojModel();

        //si se selecciona una marca
        if (isset($_GET["marca"])) 
        {
            $idMarca = intval($_GET["marca"]);
            $response = $model->allByMarca($idMarca);
            echo json_encode($response);
            return;
        }
        //si no trae a todos
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
    $request = json_decode(file_get_contents("php://input"));

    $model = new RelojModel();

    $request->id_usuario = 2;

    $response = $model->create($request);

    echo json_encode($response);
}

    public function update()
    {
        $model = new RelojModel();

        // 1. Detectar el origen de los datos
        if (!empty($_POST)) {
            // Si viene de FormData (React enviando imagen)
            $request = (object)$_POST;
            
            // Las categorías viajan como string JSON en FormData, las decodificamos
            if (isset($request->categorias) && is_string($request->categorias)) {
                $request->categorias = json_decode($request->categorias);
            }
        } else {
            // Si viene como JSON plano (sin imagen)
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