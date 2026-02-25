-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 25-02-2026 a las 02:33:03
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
CREATE DATABASE subasta_relojes;
USE subasta_relojes;
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
(1, 'Rolex'),
(2, 'Patek Philippe'),
(3, 'Cartier'),
(4, 'Audemars Piguet'),
(5, 'Ulysse Nardin'),
(6, 'Franck Muller');
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
  `id_condicion` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `reloj`
--

INSERT INTO `reloj` (`id_reloj`, `modelo`, `descripcion`, `imagen`, `anio_fabricacion`, `precio_estimado`, `id_marca`, `id_condicion`) VALUES
/*ROLEX id = 1*/
(1, 'Submariner Date', 'Reloj de buceo automático de lujo', 'rolex_submariner.jpg', '2022', 12000.00, 1, 1),
(2, 'Daytona Cosmograph', 'Cronógrafo deportivo de lujo', 'rolex_daytona.jpg', '2021', 18000.00, 1, 2),
(3, 'GMT-Master II', 'Reloj para viajeros de doble huso horario', 'rolex_gmt.jpg', '2023', 15000.00, 1, 1),
/*PATEK PHILIPE id = 2*/
(4, 'Nautilus 5711', 'Reloj deportivo elegante de acero', 'patek_nautilus.webp', '2020', 90000.00, 2, 3),
(5, 'Aquanaut 5167A', 'Reloj moderno deportivo de lujo', 'patek_aquanaut.webp', '2022', 65000.00, 2, 1),
(6, 'Calatrava 5227J', 'Reloj clásico de vestir en oro', 'patek_calatrava.jpg', '2019', 40000.00, 2, 2),
/*CARTIER id = 3*/
(7, 'Santos de Cartier', 'Diseño elegante y moderno', 'cartier_santos.webp', '2023', 8500.00, 3, 1),
(8, 'Tank Must', 'Reloj clásico rectangular icónico', 'cartier_tank.webp', '2021', 7000.00, 3, 2),
(9, 'Ballon Bleu', 'Diseño sofisticado y redondo', 'cartier_ballon.webp', '2022', 9500.00, 3, 1),
/*AUDEMARS PIGUET id = 4*/
(10, 'Royal Oak', 'Diseño octogonal legendario', 'ap_royaloak.webp', '2022', 55000.00, 4, 1),
(11, 'Royal Oak Offshore', 'Versión deportiva robusta', 'ap_offshore.webp', '2021', 48000.00, 4, 2),
(12, 'Code 11.59', 'Modelo moderno y refinado', 'ap_code.webp', '2023', 52000.00, 4, 1),
/*ULYSSE NARDIN id = 5*/
(13, 'Marine Chronometer', 'Reloj marino de alta precisión', 'ulysse_marine.webp', '2022', 12000.00, 5, 1),
(14, 'Diver 42mm', 'Reloj profesional de buceo', 'ulysse_diver.jpg', '2021', 9500.00, 5, 2),
(15, 'Freak X', 'Diseño innovador sin agujas', 'ulysse_freak.jpg', '2023', 25000.00, 5, 1),
/*FRANCK MULLER id = 6*/
(16, 'Vanguard', 'Diseño audaz y deportivo', 'fm_vanguard.webp', '2022', 22000.00, 6, 1),
(17, 'Cintrée Curvex', 'Caja curvada elegante', 'fm_cintree.webp', '2021', 18000.00, 6, 2),
(18, 'Crazy Hours', 'Diseño exclusivo con numeración creativa', 'fm_crazyhours.webp', '2023', 26000.00, 6, 1);

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
(2, 'Mariana', 'Lopez', 'vendedor@relojes.com', '$2y$10$EjemploHashVendedor', '87776655', '2026-02-22 12:55:32', 2, 1),
(3, 'Diego', 'Fernandez', 'cliente@relojes.com', '$2y$10$EjemploHashCliente', '86665544', '2026-02-22 12:55:32', 3, 1);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `condicion`
--
ALTER TABLE `condicion`
  ADD PRIMARY KEY (`id_condicion`),
  ADD UNIQUE KEY `nombre` (`nombre`);

--
-- Indices de la tabla `estado_pago`
--
ALTER TABLE `estado_pago`
  ADD PRIMARY KEY (`id_estado_pago`);

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
  ADD UNIQUE KEY `id_subasta` (`id_subasta`),
  ADD KEY `fk_ganador_usuario` (`id_usuario`);

--
-- Indices de la tabla `marca`
--
ALTER TABLE `marca`
  ADD PRIMARY KEY (`id_marca`),
  ADD UNIQUE KEY `nombre` (`nombre`);

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
  ADD UNIQUE KEY `id_ganador` (`id_ganador`),
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
  ADD KEY `fk_reloj_condicion` (`id_condicion`);

--
-- Indices de la tabla `reloj_vendedor`
--
ALTER TABLE `reloj_vendedor`
  ADD PRIMARY KEY (`id_reloj_vendedor`),
  ADD KEY `fk_rv_reloj` (`id_reloj`),
  ADD KEY `fk_rv_usuario` (`id_usuario_vendedor`),
  ADD KEY `fk_reloj_vendedor_estado` (`id_estado_reloj_vendedor`);

--
-- Indices de la tabla `rol`
--
ALTER TABLE `rol`
  ADD PRIMARY KEY (`id_rol`),
  ADD UNIQUE KEY `nombre` (`nombre`);

--
-- Indices de la tabla `subasta`
--
ALTER TABLE `subasta`
  ADD PRIMARY KEY (`id_subasta`),
  ADD UNIQUE KEY `id_reloj_vendedor` (`id_reloj_vendedor`),
  ADD KEY `fk_subasta_estado` (`id_estado_subasta`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id_usuario`),
  ADD UNIQUE KEY `correo` (`correo`),
  ADD KEY `fk_usuario_rol` (`id_rol`),
  ADD KEY `fk_usuario_estado` (`id_estado_usuario`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

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
-- AUTO_INCREMENT de la tabla `estado_reloj_vendedor`
--
ALTER TABLE `estado_reloj_vendedor`
  MODIFY `id_estado_reloj_vendedor` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

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
  MODIFY `id_ganador` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `marca`
--
ALTER TABLE `marca`
  MODIFY `id_marca` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `metodo_pago`
--
ALTER TABLE `metodo_pago`
  MODIFY `id_metodo_pago` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `pago`
--
ALTER TABLE `pago`
  MODIFY `id_pago` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `puja`
--
ALTER TABLE `puja`
  MODIFY `id_puja` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `reloj`
--
ALTER TABLE `reloj`
  MODIFY `id_reloj` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `reloj_vendedor`
--
ALTER TABLE `reloj_vendedor`
  MODIFY `id_reloj_vendedor` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `rol`
--
ALTER TABLE `rol`
  MODIFY `id_rol` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `subasta`
--
ALTER TABLE `subasta`
  MODIFY `id_subasta` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

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
  ADD CONSTRAINT `fk_reloj_condicion` FOREIGN KEY (`id_condicion`) REFERENCES `condicion` (`id_condicion`),
  ADD CONSTRAINT `fk_reloj_marca` FOREIGN KEY (`id_marca`) REFERENCES `marca` (`id_marca`);

--
-- Filtros para la tabla `reloj_vendedor`
--
ALTER TABLE `reloj_vendedor`
  ADD CONSTRAINT `fk_reloj_vendedor_estado` FOREIGN KEY (`id_estado_reloj_vendedor`) REFERENCES `estado_reloj_vendedor` (`id_estado_reloj_vendedor`),
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
