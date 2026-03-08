-- phpMyAdmin SQL Dump 
-- version 5.2.1 
-- https://www.phpmyadmin.net/ 
-- 
-- Servidor: 127.0.0.1 
-- Tiempo de generación: 08-03-2026 a las 02:57:18 
-- Versión del servidor: 10.4.32 
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

DROP DATABASE IF EXISTS subasta_relojes;
CREATE DATABASE subasta_relojes CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE subasta_relojes;

-- =========================================================
-- 1) TABLAS DE CATÁLOGO
-- =========================================================

CREATE TABLE condicion (
    id_condicion INT NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(20) NOT NULL,
    PRIMARY KEY (id_condicion),
    UNIQUE KEY uq_condicion_nombre (nombre)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE estado_pago (
    id_estado_pago INT NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(20) DEFAULT NULL,
    PRIMARY KEY (id_estado_pago)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE estado_reloj_vendedor (
    id_estado_reloj_vendedor INT NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(20) DEFAULT NULL,
    PRIMARY KEY (id_estado_reloj_vendedor)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE estado_subasta (
    id_estado_subasta INT NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(20) NOT NULL,
    PRIMARY KEY (id_estado_subasta)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE estado_usuario (
    id_estado_usuario INT NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(20) NOT NULL,
    PRIMARY KEY (id_estado_usuario)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE marca (
    id_marca INT NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL,
    PRIMARY KEY (id_marca),
    UNIQUE KEY uq_marca_nombre (nombre)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE metodo_pago (
    id_metodo_pago INT NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(20) DEFAULT NULL,
    PRIMARY KEY (id_metodo_pago)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE rol (
    id_rol INT NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(30) NOT NULL,
    PRIMARY KEY (id_rol),
    UNIQUE KEY uq_rol_nombre (nombre)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- =========================================================
-- 2) TABLAS PRINCIPALES
-- =========================================================

CREATE TABLE usuario (
    id_usuario INT NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    correo VARCHAR(100) NOT NULL,
    contrasena VARCHAR(255) NOT NULL,
    telefono VARCHAR(20) DEFAULT NULL,
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    id_rol INT NOT NULL,
    id_estado_usuario INT DEFAULT NULL,
    PRIMARY KEY (id_usuario),
    UNIQUE KEY uq_usuario_correo (correo),
    KEY fk_usuario_rol (id_rol),
    KEY fk_usuario_estado (id_estado_usuario),
    CONSTRAINT fk_usuario_rol FOREIGN KEY (id_rol) REFERENCES rol(id_rol),
    CONSTRAINT fk_usuario_estado FOREIGN KEY (id_estado_usuario) REFERENCES estado_usuario(id_estado_usuario)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE reloj (
    id_reloj INT NOT NULL AUTO_INCREMENT,
    modelo VARCHAR(50) NOT NULL,
    descripcion TEXT DEFAULT NULL,
    imagen VARCHAR(255) DEFAULT NULL,
    anio_fabricacion YEAR DEFAULT NULL,
    precio_estimado DECIMAL(10,2) DEFAULT NULL,
    id_marca INT NOT NULL,
    id_condicion INT NOT NULL,
    fecha_registro DATE NOT NULL,
    PRIMARY KEY (id_reloj),
    KEY fk_reloj_marca (id_marca),
    KEY fk_reloj_condicion (id_condicion),
    CONSTRAINT fk_reloj_marca FOREIGN KEY (id_marca) REFERENCES marca(id_marca),
    CONSTRAINT fk_reloj_condicion FOREIGN KEY (id_condicion) REFERENCES condicion(id_condicion)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE reloj_vendedor (
    id_reloj_vendedor INT NOT NULL AUTO_INCREMENT,
    id_reloj INT NOT NULL,
    id_usuario_vendedor INT NOT NULL,
    fecha_publicacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    id_estado_reloj_vendedor INT DEFAULT NULL,
    PRIMARY KEY (id_reloj_vendedor),
    KEY fk_rv_reloj (id_reloj),
    KEY fk_rv_usuario (id_usuario_vendedor),
    KEY fk_rv_estado (id_estado_reloj_vendedor),
    CONSTRAINT fk_rv_reloj FOREIGN KEY (id_reloj) REFERENCES reloj(id_reloj),
    CONSTRAINT fk_rv_usuario FOREIGN KEY (id_usuario_vendedor) REFERENCES usuario(id_usuario),
    CONSTRAINT fk_rv_estado FOREIGN KEY (id_estado_reloj_vendedor) REFERENCES estado_reloj_vendedor(id_estado_reloj_vendedor)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE subasta (
    id_subasta INT NOT NULL AUTO_INCREMENT,
    fecha_inicio DATETIME NOT NULL,
    fecha_fin DATETIME NOT NULL,
    precio_inicial DECIMAL(10,2) NOT NULL,
    incremento_minimo DECIMAL(10,2) NOT NULL,
    id_reloj_vendedor INT NOT NULL,
    id_estado_subasta INT DEFAULT NULL,
    PRIMARY KEY (id_subasta),
    UNIQUE KEY uq_subasta_reloj_vendedor (id_reloj_vendedor),
    KEY fk_subasta_estado (id_estado_subasta),
    CONSTRAINT fk_subasta_reloj_vendedor FOREIGN KEY (id_reloj_vendedor) REFERENCES reloj_vendedor(id_reloj_vendedor),
    CONSTRAINT fk_subasta_estado FOREIGN KEY (id_estado_subasta) REFERENCES estado_subasta(id_estado_subasta)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE puja (
    id_puja INT NOT NULL AUTO_INCREMENT,
    monto DECIMAL(10,2) NOT NULL,
    fecha_hora DATETIME DEFAULT CURRENT_TIMESTAMP,
    id_usuario INT NOT NULL,
    id_subasta INT NOT NULL,
    PRIMARY KEY (id_puja),
    KEY fk_puja_usuario (id_usuario),
    KEY fk_puja_subasta (id_subasta),
    CONSTRAINT fk_puja_usuario FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario),
    CONSTRAINT fk_puja_subasta FOREIGN KEY (id_subasta) REFERENCES subasta(id_subasta)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE ganador (
    id_ganador INT NOT NULL AUTO_INCREMENT,
    monto_final DECIMAL(10,2) NOT NULL,
    fecha_asignacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    id_usuario INT NOT NULL,
    id_subasta INT NOT NULL,
    PRIMARY KEY (id_ganador),
    UNIQUE KEY uq_ganador_subasta (id_subasta),
    KEY fk_ganador_usuario (id_usuario),
    CONSTRAINT fk_ganador_usuario FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario),
    CONSTRAINT fk_ganador_subasta FOREIGN KEY (id_subasta) REFERENCES subasta(id_subasta)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE pago (
    id_pago INT NOT NULL AUTO_INCREMENT,
    monto DECIMAL(10,2) NOT NULL,
    fecha_pago DATETIME DEFAULT NULL,
    id_ganador INT NOT NULL,
    id_estado_pago INT DEFAULT NULL,
    id_metodo_pago INT DEFAULT NULL,
    PRIMARY KEY (id_pago),
    UNIQUE KEY uq_pago_ganador (id_ganador),
    KEY fk_pago_estado (id_estado_pago),
    KEY fk_pago_metodo (id_metodo_pago),
    CONSTRAINT fk_pago_ganador FOREIGN KEY (id_ganador) REFERENCES ganador(id_ganador),
    CONSTRAINT fk_pago_estado FOREIGN KEY (id_estado_pago) REFERENCES estado_pago(id_estado_pago),
    CONSTRAINT fk_pago_metodo FOREIGN KEY (id_metodo_pago) REFERENCES metodo_pago(id_metodo_pago)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- =========================================================
-- 3) DATOS DE CATÁLOGO
-- =========================================================

-- Condiciones del reloj
INSERT INTO condicion (id_condicion, nombre) VALUES
(1, 'Nuevo'),
(2, 'Usado'),
(3, 'Reacondicionado');

-- Estado de pagos
INSERT INTO estado_pago (id_estado_pago, nombre) VALUES
(1, 'pendiente'),
(2, 'pagado'),
(3, 'rechazado');

-- Estado del reloj publicado por vendedor
INSERT INTO estado_reloj_vendedor (id_estado_reloj_vendedor, nombre) VALUES
(1, 'disponible'),
(2, 'subastado');

-- Estado de la subasta
INSERT INTO estado_subasta (id_estado_subasta, nombre) VALUES
(1, 'activa'),
(2, 'cerrada'),
(3, 'cancelada');

-- Estado del usuario
INSERT INTO estado_usuario (id_estado_usuario, nombre) VALUES
(1, 'Activo'),
(2, 'Inactivo'),
(3, 'Suspendido');

-- Marcas
INSERT INTO marca (id_marca, nombre) VALUES
(1, 'Rolex'),
(2, 'Patek Philippe'),
(3, 'Cartier'),
(4, 'Audemars Piguet'),
(5, 'Ulysse Nardin'),
(6, 'Franck Muller');

-- Métodos de pago
INSERT INTO metodo_pago (id_metodo_pago, nombre) VALUES
(1, 'tarjeta'),
(2, 'transferencia'),
(3, 'paypal');

-- Roles
INSERT INTO rol (id_rol, nombre) VALUES
(1, 'Administrador'),
(2, 'Vendedor'),
(3, 'Cliente');

-- =========================================================
-- 4) USUARIOS
-- =========================================================

-- 1 administrador
-- 4 vendedores
-- 3 clientes
INSERT INTO usuario
(id_usuario, nombre, apellido, correo, contrasena, telefono, fecha_registro, id_rol, id_estado_usuario)
VALUES
(1, 'Axel', 'Guzman', 'admin@relojes.com', '$2y$10$EjemploHashAdmin', '88887777', '2026-02-22 12:55:32', 1, 1),
(2, 'Erin', 'Huang', 'erin.vendedor@relojes.com', '$2y$10$EjemploHashVend1', '88886666', '2026-02-22 12:40:32', 2, 1),
(3, 'Mariana', 'Lopez', 'mariana.vendedor@relojes.com', '$2y$10$EjemploHashVend2', '87776655', '2026-02-22 12:55:32', 2, 1),
(4, 'Diego', 'Fernandez', 'diego.cliente@relojes.com', '$2y$10$EjemploHashCliente1', '86665544', '2026-02-22 12:55:32', 3, 1),
(5, 'Andres', 'Lopez', 'andres.vendedor@test.com', '1234', '88881111', '2026-02-26 21:36:13', 2, 1),
(6, 'Maria', 'Gonzalez', 'maria.vendedora@test.com', '1234', '88882222', '2026-02-26 21:36:13', 2, 1),
(7, 'Luis', 'Ramirez', 'luis.cliente@test.com', '1234', '88883333', '2026-02-26 21:42:04', 3, 1),
(8, 'Sofia', 'Martinez', 'sofia.cliente@test.com', '1234', '88884444', '2026-02-26 21:42:04', 3, 1);

-- =========================================================
-- 5) RELOJES
-- =========================================================

INSERT INTO reloj
(id_reloj, modelo, descripcion, imagen, anio_fabricacion, precio_estimado, id_marca, id_condicion, fecha_registro)
VALUES
(1, 'Submariner Date', 'Reloj de buceo automático de lujo', 'rolex_submariner.jpg', 2022, 12000.00, 1, 1, '2026-03-03'),
(2, 'Daytona Cosmograph', 'Cronógrafo deportivo de lujo', 'rolex_daytona.jpg', 2021, 18000.00, 1, 2, '2026-03-03'),
(3, 'GMT-Master II', 'Reloj para viajeros de doble huso horario', 'rolex_gmt.jpg', 2023, 15000.00, 1, 1, '2026-03-03'),
(4, 'Nautilus 5711', 'Reloj deportivo elegante de acero', 'patek_nautilus.webp', 2020, 90000.00, 2, 3, '2026-03-03'),
(5, 'Aquanaut 5167A', 'Reloj moderno deportivo de lujo', 'patek_aquanaut.webp', 2022, 65000.00, 2, 1, '2026-03-03'),
(6, 'Calatrava 5227J', 'Reloj clásico de vestir en oro', 'patek_calatrava.jpg', 2019, 40000.00, 2, 2, '2026-03-03'),
(7, 'Santos de Cartier', 'Diseño elegante y moderno', 'cartier_santos.webp', 2023, 8500.00, 3, 1, '2026-03-03'),
(8, 'Tank Must', 'Reloj clásico rectangular icónico', 'cartier_tank.webp', 2021, 7000.00, 3, 2, '2026-03-03'),
(9, 'Ballon Bleu', 'Diseño sofisticado y redondo', 'cartier_ballon.webp', 2022, 9500.00, 3, 1, '2026-03-03'),
(10, 'Royal Oak', 'Diseño octogonal legendario', 'ap_royaloak.webp', 2022, 55000.00, 4, 1, '2026-03-03'),
(11, 'Royal Oak Offshore', 'Versión deportiva robusta', 'ap_offshore.webp', 2021, 48000.00, 4, 2, '2026-03-03'),
(12, 'Code 11.59', 'Modelo moderno y refinado', 'ap_code.webp', 2023, 52000.00, 4, 1, '2026-03-03'),
(13, 'Marine Chronometer', 'Reloj marino de alta precisión', 'ulysse_marine.webp', 2022, 12000.00, 5, 1, '2026-03-03'),
(14, 'Diver 42mm', 'Reloj profesional de buceo', 'ulysse_diver.jpg', 2021, 9500.00, 5, 2, '2026-03-03'),
(15, 'Freak X', 'Diseño innovador sin agujas', 'ulysse_freak.jpg', 2023, 25000.00, 5, 1, '2026-03-03'),
(16, 'Vanguard', 'Diseño audaz y deportivo', 'fm_vanguard.webp', 2022, 22000.00, 6, 1, '2026-03-03'),
(17, 'Cintrée Curvex', 'Caja curvada elegante', 'fm_cintree.webp', 2021, 18000.00, 6, 2, '2026-03-03'),
(18, 'Crazy Hours', 'Diseño exclusivo con numeración creativa', 'fm_crazyhours.webp', 2023, 26000.00, 6, 1, '2026-03-03');

-- =========================================================
-- 6) RELOJES PUBLICADOS POR VENDEDORES
-- =========================================================
-- Se insertan 10 relojes publicados:
-- 5 que terminarán en subastas activas
-- 5 que terminarán en subastas cerradas

INSERT INTO reloj_vendedor
(id_reloj_vendedor, id_reloj, id_usuario_vendedor, fecha_publicacion, id_estado_reloj_vendedor)
VALUES
-- Ya existentes / base inicial
(1, 1, 2, '2026-02-26 21:34:50', 2), -- Submariner Date -> finalizada
(2, 2, 5, '2026-02-26 21:37:03', 2), -- Daytona Cosmograph -> finalizada
(3, 3, 6, '2026-02-26 21:37:03', 1), -- GMT-Master II -> activa

-- Nuevos para completar 10 subastas
(4, 4, 3, '2026-02-24 10:00:00', 2), -- Nautilus 5711 -> finalizada
(5, 5, 5, '2026-03-01 09:30:00', 1), -- Aquanaut 5167A -> activa
(6, 6, 6, '2026-02-23 15:20:00', 2), -- Calatrava 5227J -> finalizada
(7, 7, 3, '2026-03-02 11:10:00', 1), -- Santos de Cartier -> activa
(8, 8, 5, '2026-02-22 16:00:00', 2), -- Tank Must -> finalizada
(9, 10, 6, '2026-03-03 13:45:00', 1), -- Royal Oak -> activa
(10, 11, 2, '2026-03-04 14:10:00', 1); -- Royal Oak Offshore -> activa

-- =========================================================
-- 7) SUBASTAS
-- =========================================================
-- id_estado_subasta:
-- 1 = activa
-- 2 = cerrada

INSERT INTO subasta
(id_subasta, fecha_inicio, fecha_fin, precio_inicial, incremento_minimo, id_reloj_vendedor, id_estado_subasta)
VALUES
-- FINALIZADAS (5)
(1, '2026-02-26 21:40:33', '2026-03-05 21:40:33', 150000.00,  5000.00, 1, 2), -- Submariner Date
(2, '2026-02-26 21:40:33', '2026-03-03 21:40:33', 200000.00, 10000.00, 2, 2), -- Daytona Cosmograph
(3, '2026-02-24 12:00:00', '2026-03-01 20:00:00', 850000.00, 25000.00, 4, 2), -- Nautilus 5711
(4, '2026-02-23 16:00:00', '2026-03-02 18:30:00', 420000.00, 15000.00, 6, 2), -- Calatrava 5227J
(5, '2026-02-22 17:30:00', '2026-03-04 19:00:00',  90000.00,  5000.00, 8, 2), -- Tank Must

-- ACTIVAS (5)
(6,  '2026-02-26 21:40:33', '2026-03-08 21:40:33', 300000.00, 15000.00, 3, 1), -- GMT-Master II
(7,  '2026-03-01 10:00:00', '2026-03-12 21:00:00', 650000.00, 20000.00, 5, 1), -- Aquanaut 5167A
(8,  '2026-03-02 09:00:00', '2026-03-15 22:00:00', 110000.00,  5000.00, 7, 1), -- Santos de Cartier
(9,  '2026-03-03 14:00:00', '2026-03-18 21:30:00', 780000.00, 30000.00, 9, 1), -- Royal Oak
(10, '2026-03-04 15:00:00', '2026-03-20 20:00:00', 690000.00, 25000.00, 10, 1); -- Royal Oak Offshore

-- =========================================================
-- 8) PUJAS
-- =========================================================
-- Clientes que pujan:
-- 4 = Diego Fernandez
-- 7 = Luis Ramirez
-- 8 = Sofia Martinez

INSERT INTO puja
(id_puja, monto, fecha_hora, id_usuario, id_subasta)
VALUES
-- SUBASTA 1 (finalizada) - Submariner Date
(1, 160000.00, '2026-02-27 10:00:00', 4, 1),
(2, 170000.00, '2026-02-28 12:15:00', 7, 1),
(3, 180000.00, '2026-03-01 18:40:00', 8, 1),

-- SUBASTA 2 (finalizada) - Daytona Cosmograph
(4, 215000.00, '2026-02-26 21:42:54', 4, 2),
(5, 225000.00, '2026-02-27 14:30:00', 8, 2),
(6, 235000.00, '2026-02-28 19:20:00', 7, 2),

-- SUBASTA 3 (finalizada) - Nautilus 5711
(7, 875000.00, '2026-02-25 09:00:00', 7, 3),
(8, 900000.00, '2026-02-26 14:30:00', 8, 3),
(9, 925000.00, '2026-02-28 19:10:00', 4, 3),

-- SUBASTA 4 (finalizada) - Calatrava 5227J
(10, 435000.00, '2026-02-24 10:00:00', 4, 4),
(11, 450000.00, '2026-02-26 16:10:00', 7, 4),
(12, 465000.00, '2026-03-01 20:25:00', 8, 4),

-- SUBASTA 5 (finalizada) - Tank Must
(13, 95000.00, '2026-02-23 13:00:00', 8, 5),
(14, 100000.00, '2026-02-25 17:45:00', 4, 5),
(15, 105000.00, '2026-03-03 18:15:00', 7, 5),

-- SUBASTA 6 (activa) - GMT-Master II
(16, 315000.00, '2026-02-27 11:00:00', 4, 6),
(17, 330000.00, '2026-02-28 13:20:00', 7, 6),
(18, 345000.00, '2026-03-02 17:45:00', 8, 6),

-- SUBASTA 7 (activa) - Aquanaut 5167A
(19, 670000.00, '2026-03-02 10:00:00', 8, 7),
(20, 690000.00, '2026-03-03 12:40:00', 4, 7),
(21, 710000.00, '2026-03-05 15:20:00', 7, 7),

-- SUBASTA 8 (activa) - Santos de Cartier
(22, 115000.00, '2026-03-03 09:40:00', 7, 8),
(23, 120000.00, '2026-03-04 11:00:00', 8, 8),
(24, 125000.00, '2026-03-06 18:35:00', 4, 8),

-- SUBASTA 9 (activa) - Royal Oak
(25, 810000.00, '2026-03-04 10:30:00', 4, 9),
(26, 840000.00, '2026-03-05 14:20:00', 7, 9),
(27, 870000.00, '2026-03-06 19:50:00', 8, 9),

-- SUBASTA 10 (activa) - Royal Oak Offshore
(28, 715000.00, '2026-03-05 11:15:00', 8, 10),
(29, 740000.00, '2026-03-06 16:45:00', 4, 10),
(30, 765000.00, '2026-03-07 20:10:00', 7, 10);

-- =========================================================
-- 9) GANADORES DE SUBASTAS CERRADAS
-- =========================================================
-- Se registra el mejor postor de las 5 subastas cerradas

INSERT INTO ganador
(id_ganador, monto_final, fecha_asignacion, id_usuario, id_subasta)
VALUES
(1, 180000.00, '2026-03-05 21:45:00', 8, 1),
(2, 235000.00, '2026-03-03 21:50:00', 7, 2),
(3, 925000.00, '2026-03-01 20:05:00', 4, 3),
(4, 465000.00, '2026-03-02 18:40:00', 8, 4),
(5, 105000.00, '2026-03-04 19:10:00', 7, 5);

-- =========================================================
-- 10) PAGOS DE LOS GANADORES
-- =========================================================

INSERT INTO pago
(id_pago, monto, fecha_pago, id_ganador, id_estado_pago, id_metodo_pago)
VALUES
(1, 180000.00, '2026-03-06 10:00:00', 1, 2, 1),
(2, 235000.00, '2026-03-04 09:30:00', 2, 2, 2),
(3, 925000.00, '2026-03-02 11:15:00', 3, 1, 3),
(4, 465000.00, '2026-03-03 10:20:00', 4, 2, 1),
(5, 105000.00, '2026-03-05 08:45:00', 5, 1, 2);

-- =========================================================
-- 11) AUTO_INCREMENT CORREGIDOS
-- =========================================================

ALTER TABLE condicion AUTO_INCREMENT = 4;
ALTER TABLE estado_pago AUTO_INCREMENT = 4;
ALTER TABLE estado_reloj_vendedor AUTO_INCREMENT = 3;
ALTER TABLE estado_subasta AUTO_INCREMENT = 4;
ALTER TABLE estado_usuario AUTO_INCREMENT = 4;
ALTER TABLE marca AUTO_INCREMENT = 7;
ALTER TABLE metodo_pago AUTO_INCREMENT = 4;
ALTER TABLE rol AUTO_INCREMENT = 4;
ALTER TABLE usuario AUTO_INCREMENT = 9;
ALTER TABLE reloj AUTO_INCREMENT = 19;
ALTER TABLE reloj_vendedor AUTO_INCREMENT = 11;
ALTER TABLE subasta AUTO_INCREMENT = 11;
ALTER TABLE puja AUTO_INCREMENT = 31;
ALTER TABLE ganador AUTO_INCREMENT = 6;
ALTER TABLE pago AUTO_INCREMENT = 6;

COMMIT;