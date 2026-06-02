-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 02-06-2026 a las 01:08:02
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
-- Volcado de datos para la tabla `images`
--

INSERT INTO `images` (`ID`, `post_ID`, `file_path`, `license`, `watermark_text`, `order_index`, `created_at`) VALUES
(1, 1, 'https://res.cloudinary.com/dxyufgghc/image/upload/v1780267682/Arbol_yntjfl.jpg', 'free', 'deIanPereyra', 0, '2026-06-01 03:51:30'),
(2, 2, 'https://res.cloudinary.com/dxyufgghc/image/upload/v1780268599/RosasEnLapiz_b3vlbs.jpg', 'free', 'deRominaTolosa', 0, '2026-06-01 03:55:02'),
(3, 3, 'https://res.cloudinary.com/dxyufgghc/image/upload/v1780267680/pajarosEnRamas_azutrk.jpg', 'free', 'DeIanPereyra', 0, '2026-06-01 03:57:38'),
(4, 4, 'https://res.cloudinary.com/dxyufgghc/image/upload/v1780268604/CampoOleo_suthtb.jpg', 'free', 'deRominaTolosa', 0, '2026-06-01 03:59:32'),
(5, 5, 'https://res.cloudinary.com/dxyufgghc/image/upload/v1780268597/CampoColorido_jmwqvo.jpg', 'free', 'deIanPereyra', 0, '2026-06-01 04:01:05'),
(6, 6, 'https://res.cloudinary.com/dxyufgghc/image/upload/v1780268595/paisajePintado_wcawqq.jpg', 'free', 'deRominaTolosa', 0, '2026-06-01 04:03:56'),
(8, 7, 'https://res.cloudinary.com/dxyufgghc/image/upload/v1780267677/FlorBlanca_szbjxu.jpg', 'free', 'deRominaTolosa', 0, '2026-06-01 04:07:41');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
