-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 20-04-2026 a las 01:06:59
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `subasta_relojes`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categoria`
--

CREATE TABLE `categoria` (
  `id_categoria` int(11) NOT NULL,
  `nombre` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `categoria`
--

INSERT INTO `categoria` (`id_categoria`, `nombre`) VALUES
(1, 'Deportivo'),
(2, 'Elegante'),
(3, 'Casual'),
(4, 'Digital'),
(5, 'Clásico'),
(6, 'Minimalista'),
(7, 'Lujo'),
(8, 'Militar');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `condicion`
--

CREATE TABLE `condicion` (
  `id_condicion` int(11) NOT NULL,
  `nombre` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `condicion`
--

INSERT INTO `condicion` (`id_condicion`, `nombre`) VALUES
(1, 'Nuevo'),
(3, 'Reacondicionado'),
(2, 'Usado');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estado_pago`
--

CREATE TABLE `estado_pago` (
  `id_estado_pago` int(11) NOT NULL,
  `nombre` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `estado_pago`
--

INSERT INTO `estado_pago` (`id_estado_pago`, `nombre`) VALUES
(1, 'pendiente'),
(2, 'pagado'),
(3, 'rechazado');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estado_reloj`
--

CREATE TABLE `estado_reloj` (
  `id_estado` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `estado_reloj`
--

INSERT INTO `estado_reloj` (`id_estado`, `nombre`) VALUES
(1, 'activo'),
(2, 'eliminado'),
(3, 'inactivo');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estado_reloj_vendedor`
--

CREATE TABLE `estado_reloj_vendedor` (
  `id_estado_reloj_vendedor` int(11) NOT NULL,
  `nombre` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `estado_reloj_vendedor`
--

INSERT INTO `estado_reloj_vendedor` (`id_estado_reloj_vendedor`, `nombre`) VALUES
(1, 'disponible'),
(2, 'subastado');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estado_subasta`
--

CREATE TABLE `estado_subasta` (
  `id_estado_subasta` int(11) NOT NULL,
  `nombre` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `estado_subasta`
--

INSERT INTO `estado_subasta` (`id_estado_subasta`, `nombre`) VALUES
(1, 'activa'),
(2, 'cerrada'),
(3, 'cancelada');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estado_usuario`
--

CREATE TABLE `estado_usuario` (
  `id_estado_usuario` int(11) NOT NULL,
  `nombre` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `estado_usuario`
--

INSERT INTO `estado_usuario` (`id_estado_usuario`, `nombre`) VALUES
(1, 'Activo'),
(2, 'Inactivo'),
(3, 'Suspendido');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ganador`
--

CREATE TABLE `ganador` (
  `id_ganador` int(11) NOT NULL,
  `monto_final` decimal(10,2) NOT NULL,
  `fecha_asignacion` datetime DEFAULT current_timestamp(),
  `id_usuario` int(11) NOT NULL,
  `id_subasta` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `ganador`
--

INSERT INTO `ganador` (`id_ganador`, `monto_final`, `fecha_asignacion`, `id_usuario`, `id_subasta`) VALUES
(1, 180000.00, '2026-03-05 21:45:00', 8, 1),
(2, 235000.00, '2026-03-03 21:50:00', 7, 2),
(3, 925000.00, '2026-03-01 20:05:00', 4, 3),
(4, 465000.00, '2026-03-02 18:40:00', 8, 4),
(5, 105000.00, '2026-03-04 19:10:00', 7, 5),
(6, 765000.00, '2026-04-18 21:59:26', 7, 10),
(8, 870000.00, '2026-04-18 21:59:43', 8, 9),
(10, 345000.00, '2026-04-18 22:03:36', 8, 6),
(12, 125000.00, '2026-04-18 22:03:40', 4, 8),
(13, 710000.00, '2026-04-18 22:03:44', 7, 7);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `marca`
--

CREATE TABLE `marca` (
  `id_marca` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `marca`
--

INSERT INTO `marca` (`id_marca`, `nombre`) VALUES
(4, 'Audemars Piguet'),
(3, 'Cartier'),
(6, 'Franck Muller'),
(2, 'Patek Philippe'),
(1, 'Rolex'),
(5, 'Ulysse Nardin');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `metodo_pago`
--

CREATE TABLE `metodo_pago` (
  `id_metodo_pago` int(11) NOT NULL,
  `nombre` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `metodo_pago`
--

INSERT INTO `metodo_pago` (`id_metodo_pago`, `nombre`) VALUES
(1, 'tarjeta'),
(2, 'transferencia'),
(3, 'paypal');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pago`
--

CREATE TABLE `pago` (
  `id_pago` int(11) NOT NULL,
  `monto` decimal(10,2) NOT NULL,
  `fecha_pago` datetime DEFAULT NULL,
  `id_ganador` int(11) NOT NULL,
  `id_estado_pago` int(11) DEFAULT NULL,
  `id_metodo_pago` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `pago`
--

INSERT INTO `pago` (`id_pago`, `monto`, `fecha_pago`, `id_ganador`, `id_estado_pago`, `id_metodo_pago`) VALUES
(1, 180000.00, '2026-03-06 10:00:00', 1, 2, 1),
(2, 235000.00, '2026-03-04 09:30:00', 2, 2, 2),
(3, 925000.00, '2026-03-02 11:15:00', 3, 1, 3),
(4, 465000.00, '2026-03-03 10:20:00', 4, 2, 1),
(5, 105000.00, '2026-03-05 08:45:00', 5, 1, 2),
(6, 765000.00, '2026-04-19 03:59:55', 6, 2, 1),
(7, 870000.00, '2026-04-18 21:59:43', 8, 1, 1),
(8, 345000.00, '2026-04-18 22:03:36', 10, 1, 1),
(9, 125000.00, '2026-04-18 22:03:40', 12, 1, 1),
(10, 710000.00, '2026-04-19 20:22:56', 13, 2, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `puja`
--

CREATE TABLE `puja` (
  `id_puja` int(11) NOT NULL,
  `monto` decimal(10,2) NOT NULL,
  `fecha_hora` datetime DEFAULT current_timestamp(),
  `id_usuario` int(11) NOT NULL,
  `id_subasta` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `puja`
--

INSERT INTO `puja` (`id_puja`, `monto`, `fecha_hora`, `id_usuario`, `id_subasta`) VALUES
(1, 160000.00, '2026-02-27 10:00:00', 4, 1),
(2, 170000.00, '2026-02-28 12:15:00', 7, 1),
(3, 180000.00, '2026-03-01 18:40:00', 8, 1),
(4, 215000.00, '2026-02-26 21:42:54', 4, 2),
(5, 225000.00, '2026-02-27 14:30:00', 8, 2),
(6, 235000.00, '2026-02-28 19:20:00', 7, 2),
(7, 875000.00, '2026-02-25 09:00:00', 7, 3),
(8, 900000.00, '2026-02-26 14:30:00', 8, 3),
(9, 925000.00, '2026-02-28 19:10:00', 4, 3),
(10, 435000.00, '2026-02-24 10:00:00', 4, 4),
(11, 450000.00, '2026-02-26 16:10:00', 7, 4),
(12, 465000.00, '2026-03-01 20:25:00', 8, 4),
(13, 95000.00, '2026-02-23 13:00:00', 8, 5),
(14, 100000.00, '2026-02-25 17:45:00', 4, 5),
(15, 105000.00, '2026-03-03 18:15:00', 7, 5),
(16, 315000.00, '2026-02-27 11:00:00', 4, 6),
(17, 330000.00, '2026-02-28 13:20:00', 7, 6),
(18, 345000.00, '2026-03-02 17:45:00', 8, 6),
(19, 670000.00, '2026-03-02 10:00:00', 8, 7),
(20, 690000.00, '2026-03-03 12:40:00', 4, 7),
(21, 710000.00, '2026-03-05 15:20:00', 7, 7),
(22, 115000.00, '2026-03-03 09:40:00', 7, 8),
(23, 120000.00, '2026-03-04 11:00:00', 8, 8),
(24, 125000.00, '2026-03-06 18:35:00', 4, 8),
(25, 810000.00, '2026-03-04 10:30:00', 4, 9),
(26, 840000.00, '2026-03-05 14:20:00', 7, 9),
(27, 870000.00, '2026-03-06 19:50:00', 8, 9),
(28, 715000.00, '2026-03-05 11:15:00', 8, 10),
(29, 740000.00, '2026-03-06 16:45:00', 4, 10),
(30, 765000.00, '2026-03-07 20:10:00', 7, 10),
(31, 4355555.00, '2026-04-09 21:30:11', 4, 23),
(32, 5000000.00, '2026-04-12 16:10:22', 4, 23),
(33, 6000000.00, '2026-04-12 16:11:25', 4, 23),
(34, 7000000.00, '2026-04-12 16:13:37', 4, 23),
(35, 8000000.00, '2026-04-12 16:14:47', 4, 23),
(36, 9000000.00, '2026-04-12 16:16:23', 4, 23),
(37, 9500000.00, '2026-04-12 16:19:15', 4, 23),
(38, 10000000.00, '2026-04-12 16:21:54', 4, 23),
(39, 11000000.00, '2026-04-12 16:22:31', 4, 23),
(40, 12000000.00, '2026-04-12 16:26:05', 4, 23),
(41, 13000000.00, '2026-04-12 16:28:39', 4, 23),
(42, 14000000.00, '2026-04-12 16:35:14', 4, 23),
(43, 15000000.00, '2026-04-12 16:35:28', 4, 23),
(44, 16000000.00, '2026-04-14 15:08:45', 4, 23),
(45, 17000000.00, '2026-04-14 15:44:32', 4, 23),
(46, 18000000.00, '2026-04-14 15:46:03', 4, 23),
(47, 19000000.00, '2026-04-14 15:47:35', 4, 23),
(48, 20000000.00, '2026-04-14 15:52:42', 4, 23),
(49, 20015000.00, '2026-04-18 21:45:24', 7, 23),
(50, 5100.00, '2026-04-19 13:27:23', 7, 24),
(51, 5300.00, '2026-04-19 13:27:50', 7, 24),
(52, 6500.00, '2026-04-19 14:26:36', 7, 25),
(53, 7500.00, '2026-04-19 14:26:43', 8, 25),
(54, 5100.00, '2026-04-19 14:30:27', 7, 26),
(55, 5200.00, '2026-04-19 14:32:10', 7, 26),
(56, 5300.00, '2026-04-19 14:32:25', 8, 26);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reloj`
--

CREATE TABLE `reloj` (
  `id_reloj` int(11) NOT NULL,
  `modelo` varchar(50) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `imagen` varchar(255) DEFAULT NULL,
  `anio_fabricacion` year(4) DEFAULT NULL,
  `precio_estimado` decimal(10,2) DEFAULT NULL,
  `id_marca` int(11) NOT NULL,
  `id_condicion` int(11) NOT NULL,
  `fecha_registro` date NOT NULL DEFAULT current_timestamp(),
  `id_estado` int(11) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `reloj`
--

INSERT INTO `reloj` (`id_reloj`, `modelo`, `descripcion`, `imagen`, `anio_fabricacion`, `precio_estimado`, `id_marca`, `id_condicion`, `fecha_registro`, `id_estado`) VALUES
(1, 'Submariner Date', 'Reloj de buceo automático de lujo', 'rolex_submariner.jpg', '2022', 12000.00, 1, 1, '2026-03-03', 1),
(2, 'Daytona Cosmograph', 'Cronógrafo deportivo de lujo', 'rolex_daytona.jpg', '2021', 18000.00, 1, 2, '2026-03-03', 1),
(3, 'GMT-Master II', 'Reloj para viajeros de doble huso horario', 'rolex_gmt.jpg', '2023', 15000.00, 1, 1, '2026-03-03', 1),
(4, 'Nautilus 5711', 'Reloj deportivo elegante de acero', 'patek_nautilus.webp', '2020', 90000.00, 2, 3, '2026-03-03', 1),
(5, 'Aquanaut 5167A', 'Reloj moderno deportivo de lujo', 'patek_aquanaut.webp', '2022', 65000.00, 2, 1, '2026-03-03', 1),
(6, 'Calatrava 5227J', 'Reloj clásico de vestir en oro', 'patek_calatrava.jpg', '2019', 40000.00, 2, 2, '2026-03-03', 1),
(7, 'Santos de Cartier', 'Diseño elegante y moderno', 'cartier_santos.webp', '2023', 8500.00, 3, 1, '2026-03-03', 1),
(8, 'Tank Must', 'Reloj clásico rectangular icónico', 'cartier_tank.webp', '2021', 7000.00, 3, 2, '2026-03-03', 1),
(9, 'Ballon Bleu', 'Diseño sofisticado y redondo', 'cartier_ballon.webp', '2022', 9500.00, 3, 1, '2026-03-03', 1),
(10, 'Royal Oak', 'Diseño octogonal legendario', 'ap_royaloak.webp', '2022', 55000.00, 4, 1, '2026-03-03', 1),
(11, 'Royal Oak Offshore', 'Versión deportiva robusta', 'ap_offshore.webp', '2021', 48000.00, 4, 2, '2026-03-03', 1),
(12, 'Code 11.59', 'Modelo moderno y refinado', 'ap_code.webp', '2023', 52000.00, 4, 1, '2026-03-03', 1),
(13, 'Marine Chronometer', 'Reloj marino de alta precisión', 'ulysse_marine.webp', '2022', 12000.00, 5, 1, '2026-03-03', 1),
(14, 'Diver 42mm', 'Reloj profesional de buceo', 'ulysse_diver.jpg', '2021', 9500.00, 5, 2, '2026-03-03', 1),
(15, 'Freak X', 'Diseño innovador sin agujas', 'ulysse_freak.jpg', '2023', 25000.00, 5, 1, '2026-03-03', 1),
(16, 'Vanguard', 'Diseño audaz y deportivo', 'fm_vanguard.webp', '2022', 22000.00, 6, 1, '2026-03-03', 1),
(17, 'Cintrée Curvex', 'Caja curvada elegante', 'fm_cintree.webp', '2021', 18000.00, 6, 2, '2026-03-03', 1),
(18, 'Crazy', 'Diseño exclusivo con numeración ', 'fm_crazyhours.webp', '2023', 26000.00, 6, 2, '2026-03-03', 1),
(23, 'Reloj Nuevo', 'Reloj nuevo 2026 aaa', 'reloj3.jpg', '2020', 15000.00, 5, 2, '2026-03-22', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reloj_categoria`
--

CREATE TABLE `reloj_categoria` (
  `id_reloj` int(11) NOT NULL,
  `id_categoria` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `reloj_categoria`
--

INSERT INTO `reloj_categoria` (`id_reloj`, `id_categoria`) VALUES
(1, 1),
(1, 7),
(2, 1),
(2, 7),
(3, 1),
(3, 7),
(4, 1),
(4, 7),
(5, 1),
(5, 4),
(6, 2),
(6, 5),
(7, 2),
(7, 7),
(8, 2),
(8, 5),
(9, 2),
(9, 7),
(10, 1),
(10, 7),
(11, 1),
(11, 8),
(12, 2),
(12, 6),
(13, 5),
(13, 7),
(14, 1),
(14, 8),
(15, 4),
(15, 6),
(16, 1),
(16, 6),
(17, 2),
(17, 5),
(18, 7),
(18, 8),
(23, 6),
(23, 7);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reloj_vendedor`
--

CREATE TABLE `reloj_vendedor` (
  `id_reloj_vendedor` int(11) NOT NULL,
  `id_reloj` int(11) NOT NULL,
  `id_usuario_vendedor` int(11) NOT NULL,
  `fecha_publicacion` datetime DEFAULT current_timestamp(),
  `id_estado_reloj_vendedor` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `reloj_vendedor`
--

INSERT INTO `reloj_vendedor` (`id_reloj_vendedor`, `id_reloj`, `id_usuario_vendedor`, `fecha_publicacion`, `id_estado_reloj_vendedor`) VALUES
(1, 1, 2, '2026-02-26 21:34:50', 2),
(2, 2, 5, '2026-02-26 21:37:03', 2),
(3, 3, 6, '2026-02-26 21:37:03', 1),
(4, 4, 3, '2026-02-24 10:00:00', 2),
(5, 5, 5, '2026-03-01 09:30:00', 1),
(6, 6, 6, '2026-02-23 15:20:00', 2),
(7, 7, 3, '2026-03-02 11:10:00', 1),
(8, 8, 5, '2026-02-22 16:00:00', 2),
(9, 10, 6, '2026-03-03 13:45:00', 1),
(10, 11, 2, '2026-03-04 14:10:00', 1),
(14, 1, 2, '2026-03-19 16:50:09', 1),
(15, 23, 2, '2026-03-22 15:35:38', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `rol`
--

CREATE TABLE `rol` (
  `id_rol` int(11) NOT NULL,
  `nombre` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `rol`
--

INSERT INTO `rol` (`id_rol`, `nombre`) VALUES
(1, 'Administrador'),
(3, 'Cliente'),
(2, 'Vendedor');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `subasta`
--

CREATE TABLE `subasta` (
  `id_subasta` int(11) NOT NULL,
  `fecha_inicio` datetime NOT NULL,
  `fecha_fin` datetime NOT NULL,
  `precio_inicial` decimal(10,2) NOT NULL,
  `incremento_minimo` decimal(10,2) NOT NULL,
  `id_reloj_vendedor` int(11) NOT NULL,
  `id_estado_subasta` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `subasta`
--

INSERT INTO `subasta` (`id_subasta`, `fecha_inicio`, `fecha_fin`, `precio_inicial`, `incremento_minimo`, `id_reloj_vendedor`, `id_estado_subasta`) VALUES
(1, '2026-02-26 21:40:33', '2026-03-05 21:40:33', 150000.00, 5000.00, 1, 2),
(2, '2026-02-26 21:40:33', '2026-03-03 21:40:33', 200000.00, 10000.00, 2, 2),
(3, '2026-02-24 12:00:00', '2026-03-01 20:00:00', 850000.00, 25000.00, 4, 2),
(4, '2026-02-23 16:00:00', '2026-03-02 18:30:00', 420000.00, 15000.00, 6, 2),
(5, '2026-02-22 17:30:00', '2026-03-04 19:00:00', 90000.00, 5000.00, 8, 2),
(6, '2026-02-26 21:40:33', '2026-03-08 21:40:33', 300000.00, 15000.00, 3, 2),
(7, '2026-03-01 10:00:00', '2026-03-12 21:00:00', 650000.00, 20000.00, 5, 2),
(8, '2026-03-02 09:00:00', '2026-03-15 22:00:00', 110000.00, 5000.00, 7, 2),
(9, '2026-03-03 14:00:00', '2026-03-18 21:30:00', 780000.00, 30000.00, 9, 2),
(10, '2026-03-04 15:00:00', '2026-03-20 20:00:00', 690000.00, 25000.00, 10, 2),
(18, '2026-03-20 12:49:00', '2026-03-31 12:49:00', 500000.00, 1000.00, 4, 2),
(19, '2026-03-20 13:33:00', '2026-03-31 13:33:00', 500000.00, 1000.00, 9, 2),
(20, '2026-03-21 13:45:00', '2026-03-31 13:45:00', 550000.00, 1999.00, 8, 2),
(21, '2026-03-23 15:36:00', '2026-03-31 15:36:00', 60000.00, 1500.00, 9, 2),
(22, '2026-03-23 15:50:00', '2026-03-31 15:50:00', 560000.00, 10000.00, 6, 2),
(23, '2026-03-24 15:50:00', '2026-05-06 15:50:00', 360000.00, 15000.00, 5, 1),
(24, '2026-04-19 13:26:00', '2026-04-19 13:32:00', 5000.00, 100.00, 10, 2),
(25, '2026-04-19 14:24:00', '2026-04-19 14:31:00', 5500.00, 1000.00, 8, 2),
(26, '2026-04-19 14:29:00', '2026-04-19 14:35:00', 5000.00, 100.00, 10, 2),
(27, '2026-04-19 17:05:00', '2026-04-30 17:05:00', 50000.00, 1000.00, 7, 1),
(28, '2026-04-19 17:05:00', '2026-05-10 17:05:00', 100000.00, 5000.00, 6, 1),
(29, '2026-04-19 17:05:00', '2026-05-30 17:05:00', 25000.00, 2500.00, 3, 1),
(30, '2026-04-16 17:06:00', '2026-04-30 17:06:00', 120000.00, 12000.00, 14, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `id_usuario` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `apellido` varchar(50) NOT NULL,
  `correo` varchar(100) NOT NULL,
  `contrasena` varchar(255) NOT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `fecha_registro` datetime DEFAULT current_timestamp(),
  `id_rol` int(11) NOT NULL,
  `id_estado_usuario` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`id_usuario`, `nombre`, `apellido`, `correo`, `contrasena`, `telefono`, `fecha_registro`, `id_rol`, `id_estado_usuario`) VALUES
(1, 'Axel', 'Guzman', 'admin@relojes.com', '$2y$10$EjemploHashAdmin', '88887777', '2026-02-22 12:55:32', 1, 1),
(2, 'Erin', 'Huang', 'erin.vendedor@relojes.com', '$2y$10$EjemploHashVend1', '88886666', '2026-02-22 12:40:32', 2, 1),
(3, 'Mariana', 'Lopez', 'mariana.vendedor@relojes.com', '$2y$10$EjemploHashVend2', '87776655', '2026-02-22 12:55:32', 2, 1),
(4, 'Diego', 'Fernandez', 'diego.cliente@relojes.com', '$2y$10$EjemploHashCliente1', '86665544', '2026-02-22 12:55:32', 3, 1),
(5, 'Andres', 'Lopez', 'andres.vendedor@test.com', '1234', '88881111', '2026-02-26 21:36:13', 2, 1),
(6, 'Maria', 'Gonzalez', 'maria.vendedora@test.com', '1234', '88882222', '2026-02-26 21:36:13', 2, 1),
(7, 'Luis', 'Ramirez', 'luis.cliente@test.com', '1234', '88883333', '2026-02-26 21:42:04', 3, 1),
(8, 'Sofia', 'Martinez', 'sofia.cliente@test.com', '1234', '88884444', '2026-02-26 21:42:04', 3, 1);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `categoria`
--
ALTER TABLE `categoria`
  ADD PRIMARY KEY (`id_categoria`);

--
-- Indices de la tabla `condicion`
--
ALTER TABLE `condicion`
  ADD PRIMARY KEY (`id_condicion`),
  ADD UNIQUE KEY `uq_condicion_nombre` (`nombre`);

--
-- Indices de la tabla `estado_pago`
--
ALTER TABLE `estado_pago`
  ADD PRIMARY KEY (`id_estado_pago`);

--
-- Indices de la tabla `estado_reloj`
--
ALTER TABLE `estado_reloj`
  ADD PRIMARY KEY (`id_estado`),
  ADD UNIQUE KEY `nombre` (`nombre`);

--
-- Indices de la tabla `estado_reloj_vendedor`
--
ALTER TABLE `estado_reloj_vendedor`
  ADD PRIMARY KEY (`id_estado_reloj_vendedor`);

--
-- Indices de la tabla `estado_subasta`
--
ALTER TABLE `estado_subasta`
  ADD PRIMARY KEY (`id_estado_subasta`);

--
-- Indices de la tabla `estado_usuario`
--
ALTER TABLE `estado_usuario`
  ADD PRIMARY KEY (`id_estado_usuario`);

--
-- Indices de la tabla `ganador`
--
ALTER TABLE `ganador`
  ADD PRIMARY KEY (`id_ganador`),
  ADD UNIQUE KEY `uq_ganador_subasta` (`id_subasta`),
  ADD KEY `fk_ganador_usuario` (`id_usuario`);

--
-- Indices de la tabla `marca`
--
ALTER TABLE `marca`
  ADD PRIMARY KEY (`id_marca`),
  ADD UNIQUE KEY `uq_marca_nombre` (`nombre`);

--
-- Indices de la tabla `metodo_pago`
--
ALTER TABLE `metodo_pago`
  ADD PRIMARY KEY (`id_metodo_pago`);

--
-- Indices de la tabla `pago`
--
ALTER TABLE `pago`
  ADD PRIMARY KEY (`id_pago`),
  ADD UNIQUE KEY `uq_pago_ganador` (`id_ganador`),
  ADD KEY `fk_pago_estado` (`id_estado_pago`),
  ADD KEY `fk_pago_metodo` (`id_metodo_pago`);

--
-- Indices de la tabla `puja`
--
ALTER TABLE `puja`
  ADD PRIMARY KEY (`id_puja`),
  ADD KEY `fk_puja_usuario` (`id_usuario`),
  ADD KEY `fk_puja_subasta` (`id_subasta`);

--
-- Indices de la tabla `reloj`
--
ALTER TABLE `reloj`
  ADD PRIMARY KEY (`id_reloj`),
  ADD KEY `fk_reloj_marca` (`id_marca`),
  ADD KEY `fk_reloj_condicion` (`id_condicion`),
  ADD KEY `fk_estado_reloj` (`id_estado`);

--
-- Indices de la tabla `reloj_categoria`
--
ALTER TABLE `reloj_categoria`
  ADD PRIMARY KEY (`id_reloj`,`id_categoria`),
  ADD KEY `id_categoria` (`id_categoria`);

--
-- Indices de la tabla `reloj_vendedor`
--
ALTER TABLE `reloj_vendedor`
  ADD PRIMARY KEY (`id_reloj_vendedor`),
  ADD KEY `fk_rv_reloj` (`id_reloj`),
  ADD KEY `fk_rv_usuario` (`id_usuario_vendedor`),
  ADD KEY `fk_rv_estado` (`id_estado_reloj_vendedor`);

--
-- Indices de la tabla `rol`
--
ALTER TABLE `rol`
  ADD PRIMARY KEY (`id_rol`),
  ADD UNIQUE KEY `uq_rol_nombre` (`nombre`);

--
-- Indices de la tabla `subasta`
--
ALTER TABLE `subasta`
  ADD PRIMARY KEY (`id_subasta`),
  ADD KEY `fk_subasta_estado` (`id_estado_subasta`),
  ADD KEY `fk_subasta_reloj_vendedor` (`id_reloj_vendedor`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id_usuario`),
  ADD UNIQUE KEY `uq_usuario_correo` (`correo`),
  ADD KEY `fk_usuario_rol` (`id_rol`),
  ADD KEY `fk_usuario_estado` (`id_estado_usuario`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `categoria`
--
ALTER TABLE `categoria`
  MODIFY `id_categoria` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `condicion`
--
ALTER TABLE `condicion`
  MODIFY `id_condicion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `estado_pago`
--
ALTER TABLE `estado_pago`
  MODIFY `id_estado_pago` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `estado_reloj`
--
ALTER TABLE `estado_reloj`
  MODIFY `id_estado` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `estado_reloj_vendedor`
--
ALTER TABLE `estado_reloj_vendedor`
  MODIFY `id_estado_reloj_vendedor` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `estado_subasta`
--
ALTER TABLE `estado_subasta`
  MODIFY `id_estado_subasta` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `estado_usuario`
--
ALTER TABLE `estado_usuario`
  MODIFY `id_estado_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `ganador`
--
ALTER TABLE `ganador`
  MODIFY `id_ganador` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT de la tabla `marca`
--
ALTER TABLE `marca`
  MODIFY `id_marca` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `metodo_pago`
--
ALTER TABLE `metodo_pago`
  MODIFY `id_metodo_pago` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `pago`
--
ALTER TABLE `pago`
  MODIFY `id_pago` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `puja`
--
ALTER TABLE `puja`
  MODIFY `id_puja` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=57;

--
-- AUTO_INCREMENT de la tabla `reloj`
--
ALTER TABLE `reloj`
  MODIFY `id_reloj` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT de la tabla `reloj_vendedor`
--
ALTER TABLE `reloj_vendedor`
  MODIFY `id_reloj_vendedor` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de la tabla `rol`
--
ALTER TABLE `rol`
  MODIFY `id_rol` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `subasta`
--
ALTER TABLE `subasta`
  MODIFY `id_subasta` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `ganador`
--
ALTER TABLE `ganador`
  ADD CONSTRAINT `fk_ganador_subasta` FOREIGN KEY (`id_subasta`) REFERENCES `subasta` (`id_subasta`),
  ADD CONSTRAINT `fk_ganador_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`);

--
-- Filtros para la tabla `pago`
--
ALTER TABLE `pago`
  ADD CONSTRAINT `fk_pago_estado` FOREIGN KEY (`id_estado_pago`) REFERENCES `estado_pago` (`id_estado_pago`),
  ADD CONSTRAINT `fk_pago_ganador` FOREIGN KEY (`id_ganador`) REFERENCES `ganador` (`id_ganador`),
  ADD CONSTRAINT `fk_pago_metodo` FOREIGN KEY (`id_metodo_pago`) REFERENCES `metodo_pago` (`id_metodo_pago`);

--
-- Filtros para la tabla `puja`
--
ALTER TABLE `puja`
  ADD CONSTRAINT `fk_puja_subasta` FOREIGN KEY (`id_subasta`) REFERENCES `subasta` (`id_subasta`),
  ADD CONSTRAINT `fk_puja_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`);

--
-- Filtros para la tabla `reloj`
--
ALTER TABLE `reloj`
  ADD CONSTRAINT `fk_estado_reloj` FOREIGN KEY (`id_estado`) REFERENCES `estado_reloj` (`id_estado`),
  ADD CONSTRAINT `fk_reloj_condicion` FOREIGN KEY (`id_condicion`) REFERENCES `condicion` (`id_condicion`),
  ADD CONSTRAINT `fk_reloj_marca` FOREIGN KEY (`id_marca`) REFERENCES `marca` (`id_marca`);

--
-- Filtros para la tabla `reloj_categoria`
--
ALTER TABLE `reloj_categoria`
  ADD CONSTRAINT `reloj_categoria_ibfk_1` FOREIGN KEY (`id_reloj`) REFERENCES `reloj` (`id_reloj`),
  ADD CONSTRAINT `reloj_categoria_ibfk_2` FOREIGN KEY (`id_categoria`) REFERENCES `categoria` (`id_categoria`);

--
-- Filtros para la tabla `reloj_vendedor`
--
ALTER TABLE `reloj_vendedor`
  ADD CONSTRAINT `fk_rv_estado` FOREIGN KEY (`id_estado_reloj_vendedor`) REFERENCES `estado_reloj_vendedor` (`id_estado_reloj_vendedor`),
  ADD CONSTRAINT `fk_rv_reloj` FOREIGN KEY (`id_reloj`) REFERENCES `reloj` (`id_reloj`),
  ADD CONSTRAINT `fk_rv_usuario` FOREIGN KEY (`id_usuario_vendedor`) REFERENCES `usuario` (`id_usuario`);

--
-- Filtros para la tabla `subasta`
--
ALTER TABLE `subasta`
  ADD CONSTRAINT `fk_subasta_estado` FOREIGN KEY (`id_estado_subasta`) REFERENCES `estado_subasta` (`id_estado_subasta`),
  ADD CONSTRAINT `fk_subasta_reloj_vendedor` FOREIGN KEY (`id_reloj_vendedor`) REFERENCES `reloj_vendedor` (`id_reloj_vendedor`);

--
-- Filtros para la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD CONSTRAINT `fk_usuario_estado` FOREIGN KEY (`id_estado_usuario`) REFERENCES `estado_usuario` (`id_estado_usuario`),
  ADD CONSTRAINT `fk_usuario_rol` FOREIGN KEY (`id_rol`) REFERENCES `rol` (`id_rol`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
