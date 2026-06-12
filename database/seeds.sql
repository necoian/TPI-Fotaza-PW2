--
-- PostgreSQL database dump
--

\restrict t0fmnySANshu8ZdqhrA5Ftl2aXEJWNrCmsLkxcPt4kycQWmuhC0AUUCb2OG4rt0

-- Dumped from database version 17.6
-- Dumped by pg_dump version 18.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.roles (id, name, description) VALUES (1, 'Administrador', 'Tiene acceso al sistema por completo, se encarga de administrar la página en su totalidad');
INSERT INTO public.roles (id, name, description) VALUES (2, 'Usuario', 'Tiene permisos de "usuario", puede crear, editar, eliminar y comentar publicaciones');


--
-- Data for Name: usuario; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.usuario (id, username, email, password_hash, display_name, avatar_url, bio, role_id, is_active, strikes, created_at) VALUES (1, 'elAdmin', 'ianecoloboox767@gmail.com', '$2b$10$xV77zH/LiJruWju2U8jOSuqAqJB19aymy2yU7uaLCuxS9gy3gX7ze', 'ADMINISTRADOR', 'https://res.cloudinary.com/dxyufgghc/image/upload/v1780276990/admin_zpj5ay.png', 'Soy el administrador, me encargo de que esta página funcione de manera correcta', 1, true, 0, '2026-06-01 01:26:16');
INSERT INTO public.usuario (id, username, email, password_hash, display_name, avatar_url, bio, role_id, is_active, strikes, created_at) VALUES (2, 'RominaTolosa', 'tolousaromi@gmail.com', '$2b$10$INlfPkLFiPhMhda.JT.UVOAnJ2a9SWT91eb13L2nddPr9StSgcVWW', 'Romina Tolosa', 'https://res.cloudinary.com/dxyufgghc/image/upload/v1780276990/Usuario1_dlvjvx.png', 'Amo a mi perrita y amo tomar mates', 2, true, 0, '2026-06-01 01:33:20');
INSERT INTO public.usuario (id, username, email, password_hash, display_name, avatar_url, bio, role_id, is_active, strikes, created_at) VALUES (3, 'IanPereyra', '0108.facultad@gmail.com', '$2b$10$hAnhwY/2GSW/wVydnavmsOv2dHsuJyh5l4F5sDgRFqKf5YWpTdEsi', 'Ian Pereyra', 'https://res.cloudinary.com/dxyufgghc/image/upload/v1780276990/Usuario2_pyclch.png', 'me gusta mucho programar y jugar videojuegos', 2, true, 0, '2026-06-01 01:33:20');


--
-- Data for Name: collections; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: post; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.post (id, user_id, title, description, status, comments_open, created_at, update_at, report_count, is_blocked) VALUES (1, 3, 'Arbol en el horizonte', 'Es un lindo árbol verde que está sobre una pequeña montaña, me gustan mucho los árboles', 'active', true, '2026-06-01 03:50:34', NULL, 0, false);
INSERT INTO public.post (id, user_id, title, description, status, comments_open, created_at, update_at, report_count, is_blocked) VALUES (2, 2, 'Bellas Rosas', 'Un hermoso ramo de flores de Rosas en un fondo blanco, tiene un estilo únicod de dibujo', 'active', true, '2026-06-01 03:54:13', NULL, 0, false);
INSERT INTO public.post (id, user_id, title, description, status, comments_open, created_at, update_at, report_count, is_blocked) VALUES (3, 3, 'Muchos pájaros', 'En un lugar húmedo se ve, o quizás el artista así quiso pintar la obra, unos lindos pájaros posaban sobre las ramas de yuyos del monte', 'active', true, '2026-06-01 03:56:52', NULL, 0, false);
INSERT INTO public.post (id, user_id, title, description, status, comments_open, created_at, update_at, report_count, is_blocked) VALUES (4, 2, 'Un campo único', 'Un bello campo al óleo, con un detalle único, yo soy el de la pintura', 'active', true, '2026-06-01 03:58:57', NULL, 0, false);
INSERT INTO public.post (id, user_id, title, description, status, comments_open, created_at, update_at, report_count, is_blocked) VALUES (5, 3, 'Una vida tranquila', 'Ya estoy cansado de la ciudad, quiero vivir en un lugar asiii', 'active', true, '2026-06-01 04:00:29', NULL, 0, false);
INSERT INTO public.post (id, user_id, title, description, status, comments_open, created_at, update_at, report_count, is_blocked) VALUES (6, 2, 'El medio', 'Me gusta que todo esté fielmente en equilibrio, como en esta pintura', 'active', true, '2026-06-01 04:03:00', NULL, 0, false);
INSERT INTO public.post (id, user_id, title, description, status, comments_open, created_at, update_at, report_count, is_blocked) VALUES (7, 2, 'La flor blanca', 'Ahora la flor es lo blanco, con suaves y sutiles tonos mas oscuros para producir una tenue sombra. Pero esta flor siempre brilla...', 'active', true, '2026-06-01 04:06:45', NULL, 0, false);
INSERT INTO public.post (id, user_id, title, description, status, comments_open, created_at, update_at, report_count, is_blocked) VALUES (8, 1, 'Hermosas Rosas', ' Es un archivo con copyright, no lo pueden ver los no autenticados', 'active', true, '2026-06-08 03:22:51.780246', NULL, 0, false);


--
-- Data for Name: collections_post; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: comments; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: report_reasons; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: comment_report; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: followers; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: images; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.images (id, post_id, file_path, license, watermark_text, order_index, created_at) VALUES (1, 1, 'https://res.cloudinary.com/dxyufgghc/image/upload/v1780267682/Arbol_yntjfl.jpg', 'free', 'deIanPereyra', 0, '2026-06-01 03:51:30');
INSERT INTO public.images (id, post_id, file_path, license, watermark_text, order_index, created_at) VALUES (2, 2, 'https://res.cloudinary.com/dxyufgghc/image/upload/v1780268599/RosasEnLapiz_b3vlbs.jpg', 'free', 'deRominaTolosa', 0, '2026-06-01 03:55:02');
INSERT INTO public.images (id, post_id, file_path, license, watermark_text, order_index, created_at) VALUES (3, 3, 'https://res.cloudinary.com/dxyufgghc/image/upload/v1780267680/pajarosEnRamas_azutrk.jpg', 'free', 'DeIanPereyra', 0, '2026-06-01 03:57:38');
INSERT INTO public.images (id, post_id, file_path, license, watermark_text, order_index, created_at) VALUES (4, 4, 'https://res.cloudinary.com/dxyufgghc/image/upload/v1780268604/CampoOleo_suthtb.jpg', 'free', 'deRominaTolosa', 0, '2026-06-01 03:59:32');
INSERT INTO public.images (id, post_id, file_path, license, watermark_text, order_index, created_at) VALUES (5, 5, 'https://res.cloudinary.com/dxyufgghc/image/upload/v1780268597/CampoColorido_jmwqvo.jpg', 'free', 'deIanPereyra', 0, '2026-06-01 04:01:05');
INSERT INTO public.images (id, post_id, file_path, license, watermark_text, order_index, created_at) VALUES (6, 6, 'https://res.cloudinary.com/dxyufgghc/image/upload/v1780268595/paisajePintado_wcawqq.jpg', 'free', 'deRominaTolosa', 0, '2026-06-01 04:03:56');
INSERT INTO public.images (id, post_id, file_path, license, watermark_text, order_index, created_at) VALUES (8, 7, 'https://res.cloudinary.com/dxyufgghc/image/upload/v1780267677/FlorBlanca_szbjxu.jpg', 'free', 'deRominaTolosa', 0, '2026-06-01 04:07:41');
INSERT INTO public.images (id, post_id, file_path, license, watermark_text, order_index, created_at) VALUES (9, 8, 'https://res.cloudinary.com/dxyufgghc/image/upload/v1780888971/Inicio/PWII/yedfuqll7zbi2eiemx4t.jpg', 'copyright', 'del Admin', 0, '2026-06-08 03:22:51.780246');


--
-- Data for Name: image_report; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: interested; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: messages; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: tags; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: post_tags; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: ratings; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: validator_queue; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Name: collections_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.collections_id_seq', 1, false);


--
-- Name: comment_report_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.comment_report_id_seq', 1, false);


--
-- Name: comments_uniqueid_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.comments_uniqueid_seq', 1, false);


--
-- Name: image_report_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.image_report_id_seq', 1, false);


--
-- Name: images_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.images_id_seq', 9, true);


--
-- Name: messages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.messages_id_seq', 1, false);


--
-- Name: notifications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.notifications_id_seq', 1, false);


--
-- Name: post_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.post_id_seq', 8, true);


--
-- Name: ratings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.ratings_id_seq', 1, false);


--
-- Name: report_reasons_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.report_reasons_id_seq', 1, false);


--
-- Name: roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.roles_id_seq', 2, true);


--
-- Name: tags_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.tags_id_seq', 1, false);


--
-- Name: usuario_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.usuario_id_seq', 3, true);


--
-- Name: validator_queue_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.validator_queue_id_seq', 1, false);


--
-- PostgreSQL database dump complete
--

\unrestrict t0fmnySANshu8ZdqhrA5Ftl2aXEJWNrCmsLkxcPt4kycQWmuhC0AUUCb2OG4rt0

