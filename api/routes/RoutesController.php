<?php
class RoutesController
{
    private $authMiddleware;
    private $protectedRoutes = [];

    public function __construct()
    {
        // Si luego activas JWT
        // $this->authMiddleware = new AuthMiddleware();
        // $this->registerRoutes();

        $this->routes();
    }

    public function routes()
    {
        // Manejo preflight CORS
        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            http_response_code(200);
            exit();
        }
    }

    public function index()
    {
        $requestUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
        $baseFolder = rtrim(dirname($_SERVER['SCRIPT_NAME']), '/');

        if ($baseFolder !== '/' && stripos($requestUri, $baseFolder) === 0) {
            $requestUri = substr($requestUri, strlen($baseFolder));
        }

        $routesArray = explode("/", trim($requestUri, "/"));

        // ==============================
        // 📂 Manejo de imágenes /uploads
        // ==============================
        if (isset($routesArray[0]) && $routesArray[0] === 'uploads') {
            $filePath = dirname(__DIR__) . '/' . implode("/", $routesArray);

            if (file_exists($filePath)) {
                header('Content-Type: ' . mime_content_type($filePath));
                readfile($filePath);
                exit;
            } else {
                http_response_code(404);
                echo json_encode([
                    "success" => false,
                    "message" => "Archivo no encontrado"
                ]);
                return;
            }
        }

        // ==============================
        // Validar controlador
        // ==============================
        if (empty($routesArray[0])) {
            echo json_encode([
                "success" => false,
                "status"  => 404,
                "message" => "Controlador no especificado"
            ], http_response_code(404));
            return;
        }

        // 🔥 Conversión automática a Controller
        $controllerName = ucfirst($routesArray[0]) . "Controller";
        $action  = $routesArray[1] ?? null;
        $param1  = $routesArray[2] ?? null;
        $param2  = $routesArray[3] ?? null;

        try {

            if (class_exists($controllerName)) {

                $controller = new $controllerName();

                switch ($_SERVER['REQUEST_METHOD']) {

                    case 'GET':

                        if ($action && is_numeric($action)) {
                            // GET /reloj/1
                            $controller->get($action);

                        } elseif ($action && method_exists($controller, $action)) {

                            if ($param1 && $param2) {
                                $controller->$action($param1, $param2);
                            } elseif ($param1) {
                                $controller->$action($param1);
                            } else {
                                $controller->$action();
                            }

                        } elseif (!$action) {
                            // GET /reloj
                            $controller->index();

                        } else {
                            throw new Exception("Acción no encontrada");
                        }

                        break;

                    case 'POST':

                        if ($action && method_exists($controller, $action)) {
                            $controller->$action();
                        } else {
                            $controller->create();
                        }

                        break;

                    case 'PUT':
                    case 'PATCH':

                        if ($action && is_numeric($action)) {
                            $controller->update($action);
                        } else {
                            $controller->update();
                        }

                        break;

                    case 'DELETE':

                        if ($action && is_numeric($action)) {
                            $controller->delete($action);
                        } else {
                            $controller->delete();
                        }

                        break;

                    default:
                        throw new Exception("Método HTTP no permitido");
                }

            } else {
                throw new Exception("Controlador no encontrado");
            }

        } catch (\Throwable $e) {

            http_response_code(500);

            echo json_encode([
                "success" => false,
                "status"  => 500,
                "message" => $e->getMessage()
            ]);
        }
    }
}