-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 02-06-2026 a las 01:07:35
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
-- Base de datos: `fotaza_db_ian`
--

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`ID`, `UserName`, `email`, `Password_hash`, `display_name`, `avatar_url`, `bio`, `role_id`, `is_active`, `strikes`, `created_at`) VALUES
(1, 'elAdmin', 'ianecoloboox767@gmail.com', '$2b$10$xV77zH/LiJruWju2U8jOSuqAqJB19aymy2yU7uaLCuxS9gy3gX7ze', 'ADMINISTRADOR', 'https://res.cloudinary.com/dxyufgghc/image/upload/v1780276990/admin_zpj5ay.png', 'Soy el administrador, me encargo de que esta página funcione de manera correcta', 1, 1, 0, '2026-06-01 01:26:16'),
(2, 'RominaTolosa', 'tolousaromi@gmail.com', '$2b$10$INlfPkLFiPhMhda.JT.UVOAnJ2a9SWT91eb13L2nddPr9StSgcVWW', 'Romina Tolosa', 'https://res.cloudinary.com/dxyufgghc/image/upload/v1780276990/Usuario1_dlvjvx.png', 'Amo a mi perrita y amo tomar mates', 2, 1, 0, '2026-06-01 01:33:20'),
(3, 'IanPereyra', '0108.facultad@gmail.com', '$2b$10$hAnhwY/2GSW/wVydnavmsOv2dHsuJyh5l4F5sDgRFqKf5YWpTdEsi', 'Ian Pereyra', 'https://res.cloudinary.com/dxyufgghc/image/upload/v1780276990/Usuario2_pyclch.png', 'me gusta mucho programar y jugar videojuegos', 2, 1, 0, '2026-06-01 01:33:20');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
