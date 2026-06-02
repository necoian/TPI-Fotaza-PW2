-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 02-06-2026 a las 01:07:48
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
-- Volcado de datos para la tabla `post`
--

INSERT INTO `post` (`Id`, `user_id`, `title`, `description`, `status`, `comments_open`, `created_at`, `update_at`, `report_count`, `is_blocked`) VALUES
(1, 3, 'Arbol en el horizonte', 'Es un lindo árbol verde que está sobre una pequeña montaña, me gustan mucho los árboles', 'active', 1, '2026-06-01 03:50:34', NULL, 0, 0),
(2, 2, 'Bellas Rosas', 'Un hermoso ramo de flores de Rosas en un fondo blanco, tiene un estilo únicod de dibujo', 'active', 1, '2026-06-01 03:54:13', NULL, 0, 0),
(3, 3, 'Muchos pájaros', 'En un lugar húmedo se ve, o quizás el artista así quiso pintar la obra, unos lindos pájaros posaban sobre las ramas de yuyos del monte', 'active', 1, '2026-06-01 03:56:52', NULL, 0, 0),
(4, 2, 'Un campo único', 'Un bello campo al óleo, con un detalle único, yo soy el de la pintura', 'active', 1, '2026-06-01 03:58:57', NULL, 0, 0),
(5, 3, 'Una vida tranquila', 'Ya estoy cansado de la ciudad, quiero vivir en un lugar asiii', 'active', 1, '2026-06-01 04:00:29', NULL, 0, 0),
(6, 2, 'El medio', 'Me gusta que todo esté fielmente en equilibrio, como en esta pintura', 'active', 1, '2026-06-01 04:03:00', NULL, 0, 0),
(7, 2, 'La flor blanca', 'Ahora la flor es lo blanco, con suaves y sutiles tonos mas oscuros para producir una tenue sombra. Pero esta flor siempre brilla...', 'active', 1, '2026-06-01 04:06:45', NULL, 0, 0);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
