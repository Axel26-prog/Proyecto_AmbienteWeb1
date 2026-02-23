<?php
// Composer autoloader
require_once 'vendor/autoload.php';
/*Encabezada de las solicitudes*/
/*CORS*/
header("Access-Control-Allow-Origin: * ");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");
header('Content-Type: application/json');

/*--- Requerimientos Clases o librerías*/
require_once "controllers/core/Config.php";
require_once "controllers/core/HandleException.php";
require_once "controllers/core/Logger.php";
require_once "controllers/core/MySqlConnect.php";
require_once "controllers/core/Request.php";
require_once "controllers/core/Response.php";
//Middleware
require_once "middleware/AuthMiddleware.php";

/***--- Agregar todos los modelos*/
require_once "models/CondicionModel.php";
require_once "models/EstadoPagoModel.php";
require_once "models/EstadoRelojVendedorModel.php";
require_once "models/EstadoSubastaModel.php";
require_once "models/EstadoUsuarioModel.php";
require_once "models/GanadorModel.php";
require_once "models/MarcaModel.php";
require_once "models/PagoModel.php";
require_once "models/PujaModel.php";
require_once "models/RelojModel.php";
require_once "models/RelojVendedorModel.php";
require_once "models/RolModel.php";
require_once "models/subastaModel.php";
require_once "models/UsuarioModel.php";
/***--- Agregar todos los controladores*/
require_once "controllers/CondicionController.php";
require_once "controllers/EstadoPagoController.php";
require_once "controllers/EstadoRelojVendedorController.php";
require_once "controllers/EstadoSubastaController.php";
require_once "controllers/EstadoUsuarioController.php";
require_once "controllers/GanadorController.php";
require_once "controllers/MarcaController.php";
require_once "controllers/PagoController.php";
require_once "controllers/PujaController.php";
require_once "controllers/RelojController.php";
require_once "controllers/RelojVendedorController.php";
require_once "controllers/RolController.php";
require_once "controllers/subastaController.php";
require_once "controllers/UsuarioController.php";

//Enrutador
require_once "routes/RoutesController.php";
$index = new RoutesController();
$index->index();



