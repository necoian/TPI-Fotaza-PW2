--
-- PostgreSQL database dump
--

\restrict WrbSNfgBupGVDU33QuUgQyO32MGbJUoPtE3VkCRbktft5R4PYE0AXVUwOWIfrqQ

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: collections; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.collections (
    id integer NOT NULL,
    user_id integer NOT NULL,
    name character varying(255) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: collections_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.collections_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: collections_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.collections_id_seq OWNED BY public.collections.id;


--
-- Name: collections_post; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.collections_post (
    collection_id integer NOT NULL,
    post_id integer NOT NULL,
    added_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: comment_report; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.comment_report (
    id integer NOT NULL,
    comment_id integer NOT NULL,
    user_id integer NOT NULL,
    reason_id integer NOT NULL,
    description text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: comment_report_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.comment_report_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: comment_report_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.comment_report_id_seq OWNED BY public.comment_report.id;


--
-- Name: comments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.comments (
    uniqueid integer NOT NULL,
    post_id integer NOT NULL,
    user_id integer NOT NULL,
    body text NOT NULL,
    is_deleted boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: comments_uniqueid_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.comments_uniqueid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: comments_uniqueid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.comments_uniqueid_seq OWNED BY public.comments.uniqueid;


--
-- Name: followers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.followers (
    follower_id integer NOT NULL,
    following_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: image_report; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.image_report (
    id integer NOT NULL,
    image_id integer NOT NULL,
    user_id integer NOT NULL,
    reason_id integer NOT NULL,
    description text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: image_report_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.image_report_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: image_report_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.image_report_id_seq OWNED BY public.image_report.id;


--
-- Name: images; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.images (
    id integer NOT NULL,
    post_id integer NOT NULL,
    file_path text NOT NULL,
    license character varying(50) NOT NULL,
    watermark_text character varying(255) DEFAULT NULL::character varying,
    order_index integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT images_license_check CHECK (((license)::text = ANY ((ARRAY['free'::character varying, 'copyright'::character varying])::text[])))
);


--
-- Name: images_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.images_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: images_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.images_id_seq OWNED BY public.images.id;


--
-- Name: interested; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.interested (
    user_id integer NOT NULL,
    image_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: messages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.messages (
    id integer NOT NULL,
    sender_id integer NOT NULL,
    receiver_id integer NOT NULL,
    post_id integer,
    body text NOT NULL,
    is_read boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: messages_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.messages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: messages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.messages_id_seq OWNED BY public.messages.id;


--
-- Name: notifications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.notifications (
    id integer NOT NULL,
    user_id integer NOT NULL,
    actor_id integer NOT NULL,
    type character varying(50) NOT NULL,
    entity_id integer,
    is_read boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT notifications_type_check CHECK (((type)::text = ANY ((ARRAY['comment'::character varying, 'rating'::character varying, 'interested'::character varying, 'follow'::character varying])::text[])))
);


--
-- Name: notifications_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.notifications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: notifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.notifications_id_seq OWNED BY public.notifications.id;


--
-- Name: post; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.post (
    id integer NOT NULL,
    user_id integer NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    status character varying(50) DEFAULT 'active'::character varying,
    comments_open boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_at timestamp without time zone,
    report_count integer DEFAULT 0,
    is_blocked boolean DEFAULT false,
    CONSTRAINT post_status_check CHECK (((status)::text = ANY ((ARRAY['active'::character varying, 'remove'::character varying, 'pending'::character varying])::text[])))
);


--
-- Name: post_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.post_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: post_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.post_id_seq OWNED BY public.post.id;


--
-- Name: post_tags; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.post_tags (
    post_id integer NOT NULL,
    tag_id integer NOT NULL
);


--
-- Name: ratings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ratings (
    id integer NOT NULL,
    image_id integer NOT NULL,
    user_id integer NOT NULL,
    score smallint NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT ratings_score_check CHECK (((score >= 1) AND (score <= 5)))
);


--
-- Name: ratings_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.ratings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: ratings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.ratings_id_seq OWNED BY public.ratings.id;


--
-- Name: report_reasons; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.report_reasons (
    id integer NOT NULL,
    label character varying(255) NOT NULL
);


--
-- Name: report_reasons_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.report_reasons_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: report_reasons_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.report_reasons_id_seq OWNED BY public.report_reasons.id;


--
-- Name: roles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.roles (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    description text
);


--
-- Name: roles_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.roles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.roles_id_seq OWNED BY public.roles.id;


--
-- Name: tags; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tags (
    id integer NOT NULL,
    name character varying(255) NOT NULL
);


--
-- Name: tags_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.tags_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: tags_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.tags_id_seq OWNED BY public.tags.id;


--
-- Name: usuario; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.usuario (
    id integer NOT NULL,
    username character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password_hash character varying(255) NOT NULL,
    display_name character varying(255) DEFAULT NULL::character varying,
    avatar_url character varying(255) DEFAULT NULL::character varying,
    bio text,
    role_id integer NOT NULL,
    is_active boolean DEFAULT true,
    strikes integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: usuario_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.usuario_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: usuario_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.usuario_id_seq OWNED BY public.usuario.id;


--
-- Name: validator_queue; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.validator_queue (
    id integer NOT NULL,
    post_id integer NOT NULL,
    status character varying(50) DEFAULT 'pending'::character varying,
    resolved_by integer,
    resolution character varying(50) DEFAULT NULL::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT validator_queue_resolution_check CHECK (((resolution)::text = ANY ((ARRAY['removed'::character varying, 'dismissed'::character varying])::text[]))),
    CONSTRAINT validator_queue_status_check CHECK (((status)::text = ANY ((ARRAY['pending'::character varying, 'resolved'::character varying])::text[])))
);


--
-- Name: validator_queue_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.validator_queue_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: validator_queue_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.validator_queue_id_seq OWNED BY public.validator_queue.id;


--
-- Name: collections id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.collections ALTER COLUMN id SET DEFAULT nextval('public.collections_id_seq'::regclass);


--
-- Name: comment_report id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comment_report ALTER COLUMN id SET DEFAULT nextval('public.comment_report_id_seq'::regclass);


--
-- Name: comments uniqueid; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comments ALTER COLUMN uniqueid SET DEFAULT nextval('public.comments_uniqueid_seq'::regclass);


--
-- Name: image_report id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.image_report ALTER COLUMN id SET DEFAULT nextval('public.image_report_id_seq'::regclass);


--
-- Name: images id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.images ALTER COLUMN id SET DEFAULT nextval('public.images_id_seq'::regclass);


--
-- Name: messages id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.messages ALTER COLUMN id SET DEFAULT nextval('public.messages_id_seq'::regclass);


--
-- Name: notifications id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notifications ALTER COLUMN id SET DEFAULT nextval('public.notifications_id_seq'::regclass);


--
-- Name: post id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.post ALTER COLUMN id SET DEFAULT nextval('public.post_id_seq'::regclass);


--
-- Name: ratings id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ratings ALTER COLUMN id SET DEFAULT nextval('public.ratings_id_seq'::regclass);


--
-- Name: report_reasons id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.report_reasons ALTER COLUMN id SET DEFAULT nextval('public.report_reasons_id_seq'::regclass);


--
-- Name: roles id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.roles ALTER COLUMN id SET DEFAULT nextval('public.roles_id_seq'::regclass);


--
-- Name: tags id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tags ALTER COLUMN id SET DEFAULT nextval('public.tags_id_seq'::regclass);


--
-- Name: usuario id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuario ALTER COLUMN id SET DEFAULT nextval('public.usuario_id_seq'::regclass);


--
-- Name: validator_queue id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.validator_queue ALTER COLUMN id SET DEFAULT nextval('public.validator_queue_id_seq'::regclass);


--
-- Data for Name: collections; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: collections_post; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: comment_report; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: comments; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: followers; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: image_report; Type: TABLE DATA; Schema: public; Owner: -
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
-- Data for Name: post; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.post (id, user_id, title, description, status, comments_open, created_at, update_at, report_count, is_blocked) VALUES (1, 3, 'Arbol en el horizonte', 'Es un lindo árbol verde que está sobre una pequeña montaña, me gustan mucho los árboles', 'active', true, '2026-06-01 03:50:34', NULL, 0, false);
INSERT INTO public.post (id, user_id, title, description, status, comments_open, created_at, update_at, report_count, is_blocked) VALUES (2, 2, 'Bellas Rosas', 'Un hermoso ramo de flores de Rosas en un fondo blanco, tiene un estilo únicod de dibujo', 'active', true, '2026-06-01 03:54:13', NULL, 0, false);
INSERT INTO public.post (id, user_id, title, description, status, comments_open, created_at, update_at, report_count, is_blocked) VALUES (3, 3, 'Muchos pájaros', 'En un lugar húmedo se ve, o quizás el artista así quiso pintar la obra, unos lindos pájaros posaban sobre las ramas de yuyos del monte', 'active', true, '2026-06-01 03:56:52', NULL, 0, false);
INSERT INTO public.post (id, user_id, title, description, status, comments_open, created_at, update_at, report_count, is_blocked) VALUES (4, 2, 'Un campo único', 'Un bello campo al óleo, con un detalle único, yo soy el de la pintura', 'active', true, '2026-06-01 03:58:57', NULL, 0, false);
INSERT INTO public.post (id, user_id, title, description, status, comments_open, created_at, update_at, report_count, is_blocked) VALUES (5, 3, 'Una vida tranquila', 'Ya estoy cansado de la ciudad, quiero vivir en un lugar asiii', 'active', true, '2026-06-01 04:00:29', NULL, 0, false);
INSERT INTO public.post (id, user_id, title, description, status, comments_open, created_at, update_at, report_count, is_blocked) VALUES (6, 2, 'El medio', 'Me gusta que todo esté fielmente en equilibrio, como en esta pintura', 'active', true, '2026-06-01 04:03:00', NULL, 0, false);
INSERT INTO public.post (id, user_id, title, description, status, comments_open, created_at, update_at, report_count, is_blocked) VALUES (7, 2, 'La flor blanca', 'Ahora la flor es lo blanco, con suaves y sutiles tonos mas oscuros para producir una tenue sombra. Pero esta flor siempre brilla...', 'active', true, '2026-06-01 04:06:45', NULL, 0, false);


--
-- Data for Name: post_tags; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: ratings; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: report_reasons; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.roles (id, name, description) VALUES (1, 'Administrador', 'Tiene acceso al sistema por completo, se encarga de administrar la página en su totalidad');
INSERT INTO public.roles (id, name, description) VALUES (2, 'Usuario', 'Tiene permisos de "usuario", puede crear, editar, eliminar y comentar publicaciones');


--
-- Data for Name: tags; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: usuario; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.usuario (id, username, email, password_hash, display_name, avatar_url, bio, role_id, is_active, strikes, created_at) VALUES (1, 'elAdmin', 'ianecoloboox767@gmail.com', '$2b$10$xV77zH/LiJruWju2U8jOSuqAqJB19aymy2yU7uaLCuxS9gy3gX7ze', 'ADMINISTRADOR', 'https://res.cloudinary.com/dxyufgghc/image/upload/v1780276990/admin_zpj5ay.png', 'Soy el administrador, me encargo de que esta página funcione de manera correcta', 1, true, 0, '2026-06-01 01:26:16');
INSERT INTO public.usuario (id, username, email, password_hash, display_name, avatar_url, bio, role_id, is_active, strikes, created_at) VALUES (2, 'RominaTolosa', 'tolousaromi@gmail.com', '$2b$10$INlfPkLFiPhMhda.JT.UVOAnJ2a9SWT91eb13L2nddPr9StSgcVWW', 'Romina Tolosa', 'https://res.cloudinary.com/dxyufgghc/image/upload/v1780276990/Usuario1_dlvjvx.png', 'Amo a mi perrita y amo tomar mates', 2, true, 0, '2026-06-01 01:33:20');
INSERT INTO public.usuario (id, username, email, password_hash, display_name, avatar_url, bio, role_id, is_active, strikes, created_at) VALUES (3, 'IanPereyra', '0108.facultad@gmail.com', '$2b$10$hAnhwY/2GSW/wVydnavmsOv2dHsuJyh5l4F5sDgRFqKf5YWpTdEsi', 'Ian Pereyra', 'https://res.cloudinary.com/dxyufgghc/image/upload/v1780276990/Usuario2_pyclch.png', 'me gusta mucho programar y jugar videojuegos', 2, true, 0, '2026-06-01 01:33:20');


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

SELECT pg_catalog.setval('public.images_id_seq', 8, true);


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

SELECT pg_catalog.setval('public.post_id_seq', 7, true);


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
-- Name: collections collections_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.collections
    ADD CONSTRAINT collections_pkey PRIMARY KEY (id);


--
-- Name: collections_post collections_post_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.collections_post
    ADD CONSTRAINT collections_post_pkey PRIMARY KEY (collection_id, post_id);


--
-- Name: comment_report comment_report_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comment_report
    ADD CONSTRAINT comment_report_pkey PRIMARY KEY (id);


--
-- Name: comments comments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_pkey PRIMARY KEY (uniqueid);


--
-- Name: followers followers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.followers
    ADD CONSTRAINT followers_pkey PRIMARY KEY (follower_id, following_id);


--
-- Name: image_report image_report_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.image_report
    ADD CONSTRAINT image_report_pkey PRIMARY KEY (id);


--
-- Name: images images_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.images
    ADD CONSTRAINT images_pkey PRIMARY KEY (id);


--
-- Name: interested interested_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.interested
    ADD CONSTRAINT interested_pkey PRIMARY KEY (user_id, image_id);


--
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- Name: post post_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.post
    ADD CONSTRAINT post_pkey PRIMARY KEY (id);


--
-- Name: post_tags post_tags_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.post_tags
    ADD CONSTRAINT post_tags_pkey PRIMARY KEY (post_id, tag_id);


--
-- Name: ratings ratings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ratings
    ADD CONSTRAINT ratings_pkey PRIMARY KEY (id);


--
-- Name: report_reasons report_reasons_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.report_reasons
    ADD CONSTRAINT report_reasons_pkey PRIMARY KEY (id);


--
-- Name: roles roles_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key UNIQUE (name);


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- Name: tags tags_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_name_key UNIQUE (name);


--
-- Name: tags tags_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_pkey PRIMARY KEY (id);


--
-- Name: ratings unique_image_rating_user; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ratings
    ADD CONSTRAINT unique_image_rating_user UNIQUE (image_id, user_id);


--
-- Name: image_report unique_image_user; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.image_report
    ADD CONSTRAINT unique_image_user UNIQUE (image_id, user_id);


--
-- Name: usuario usuario_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_email_key UNIQUE (email);


--
-- Name: usuario usuario_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_pkey PRIMARY KEY (id);


--
-- Name: usuario usuario_username_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_username_key UNIQUE (username);


--
-- Name: validator_queue validator_queue_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.validator_queue
    ADD CONSTRAINT validator_queue_pkey PRIMARY KEY (id);


--
-- Name: validator_queue validator_queue_post_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.validator_queue
    ADD CONSTRAINT validator_queue_post_id_key UNIQUE (post_id);


--
-- Name: image_report trg_after_image_report_insert; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_after_image_report_insert AFTER INSERT ON public.image_report FOR EACH ROW EXECUTE FUNCTION public.fn_after_image_report_insert();


--
-- Name: post trg_after_post_status_update; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_after_post_status_update AFTER UPDATE ON public.post FOR EACH ROW EXECUTE FUNCTION public.fn_after_post_status_update();


--
-- Name: collections_post collections_post_collection_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.collections_post
    ADD CONSTRAINT collections_post_collection_id_fkey FOREIGN KEY (collection_id) REFERENCES public.collections(id) ON DELETE CASCADE;


--
-- Name: collections_post collections_post_post_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.collections_post
    ADD CONSTRAINT collections_post_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.post(id) ON DELETE CASCADE;


--
-- Name: collections collections_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.collections
    ADD CONSTRAINT collections_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.usuario(id) ON DELETE CASCADE;


--
-- Name: comment_report comment_report_comment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comment_report
    ADD CONSTRAINT comment_report_comment_id_fkey FOREIGN KEY (comment_id) REFERENCES public.comments(uniqueid) ON DELETE CASCADE;


--
-- Name: comment_report comment_report_reason_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comment_report
    ADD CONSTRAINT comment_report_reason_id_fkey FOREIGN KEY (reason_id) REFERENCES public.report_reasons(id);


--
-- Name: comment_report comment_report_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comment_report
    ADD CONSTRAINT comment_report_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.usuario(id) ON DELETE CASCADE;


--
-- Name: comments comments_post_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.post(id) ON DELETE CASCADE;


--
-- Name: comments comments_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.usuario(id) ON DELETE CASCADE;


--
-- Name: followers followers_follower_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.followers
    ADD CONSTRAINT followers_follower_id_fkey FOREIGN KEY (follower_id) REFERENCES public.usuario(id) ON DELETE CASCADE;


--
-- Name: followers followers_following_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.followers
    ADD CONSTRAINT followers_following_id_fkey FOREIGN KEY (following_id) REFERENCES public.usuario(id) ON DELETE CASCADE;


--
-- Name: image_report image_report_image_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.image_report
    ADD CONSTRAINT image_report_image_id_fkey FOREIGN KEY (image_id) REFERENCES public.images(id) ON DELETE CASCADE;


--
-- Name: image_report image_report_reason_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.image_report
    ADD CONSTRAINT image_report_reason_id_fkey FOREIGN KEY (reason_id) REFERENCES public.report_reasons(id);


--
-- Name: image_report image_report_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.image_report
    ADD CONSTRAINT image_report_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.usuario(id) ON DELETE CASCADE;


--
-- Name: images images_post_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.images
    ADD CONSTRAINT images_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.post(id) ON DELETE CASCADE;


--
-- Name: interested interested_image_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.interested
    ADD CONSTRAINT interested_image_id_fkey FOREIGN KEY (image_id) REFERENCES public.images(id) ON DELETE CASCADE;


--
-- Name: interested interested_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.interested
    ADD CONSTRAINT interested_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.usuario(id) ON DELETE CASCADE;


--
-- Name: messages messages_post_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.post(id) ON DELETE SET NULL;


--
-- Name: messages messages_receiver_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_receiver_id_fkey FOREIGN KEY (receiver_id) REFERENCES public.usuario(id) ON DELETE CASCADE;


--
-- Name: messages messages_sender_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES public.usuario(id) ON DELETE CASCADE;


--
-- Name: notifications notifications_actor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_actor_id_fkey FOREIGN KEY (actor_id) REFERENCES public.usuario(id) ON DELETE CASCADE;


--
-- Name: notifications notifications_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.usuario(id) ON DELETE CASCADE;


--
-- Name: post_tags post_tags_post_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.post_tags
    ADD CONSTRAINT post_tags_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.post(id) ON DELETE CASCADE;


--
-- Name: post_tags post_tags_tag_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.post_tags
    ADD CONSTRAINT post_tags_tag_id_fkey FOREIGN KEY (tag_id) REFERENCES public.tags(id) ON DELETE CASCADE;


--
-- Name: post post_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.post
    ADD CONSTRAINT post_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.usuario(id) ON DELETE CASCADE;


--
-- Name: ratings ratings_image_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ratings
    ADD CONSTRAINT ratings_image_id_fkey FOREIGN KEY (image_id) REFERENCES public.images(id) ON DELETE CASCADE;


--
-- Name: ratings ratings_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ratings
    ADD CONSTRAINT ratings_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.usuario(id) ON DELETE CASCADE;


--
-- Name: usuario usuario_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id);


--
-- Name: validator_queue validator_queue_post_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.validator_queue
    ADD CONSTRAINT validator_queue_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.post(id) ON DELETE CASCADE;


--
-- Name: validator_queue validator_queue_resolved_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.validator_queue
    ADD CONSTRAINT validator_queue_resolved_by_fkey FOREIGN KEY (resolved_by) REFERENCES public.usuario(id) ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--

\unrestrict WrbSNfgBupGVDU33QuUgQyO32MGbJUoPtE3VkCRbktft5R4PYE0AXVUwOWIfrqQ

