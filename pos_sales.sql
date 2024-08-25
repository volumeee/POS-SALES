--
-- PostgreSQL database dump
--

-- Dumped from database version 16.4
-- Dumped by pg_dump version 16.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
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
-- Name: customers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.customers (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    phone character varying(20),
    address text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    deleted_at timestamp without time zone
);


ALTER TABLE public.customers OWNER TO postgres;

--
-- Name: customers_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.customers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.customers_id_seq OWNER TO postgres;

--
-- Name: customers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.customers_id_seq OWNED BY public.customers.id;


--
-- Name: products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    price numeric(10,2) NOT NULL,
    stock integer DEFAULT 0 NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.products OWNER TO postgres;

--
-- Name: products_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.products_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.products_id_seq OWNER TO postgres;

--
-- Name: products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.products_id_seq OWNED BY public.products.id;


--
-- Name: transaction_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.transaction_items (
    id integer NOT NULL,
    transaction_id integer,
    product_id integer,
    quantity integer NOT NULL,
    price numeric(10,2) NOT NULL
);


ALTER TABLE public.transaction_items OWNER TO postgres;

--
-- Name: transaction_items_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.transaction_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.transaction_items_id_seq OWNER TO postgres;

--
-- Name: transaction_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.transaction_items_id_seq OWNED BY public.transaction_items.id;


--
-- Name: transactions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.transactions (
    id integer NOT NULL,
    customer_id integer,
    total_amount numeric(10,2) NOT NULL,
    payment_status character varying(20) DEFAULT 'PENDING'::character varying NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.transactions OWNER TO postgres;

--
-- Name: transactions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.transactions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.transactions_id_seq OWNER TO postgres;

--
-- Name: transactions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.transactions_id_seq OWNED BY public.transactions.id;


--
-- Name: customers id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customers ALTER COLUMN id SET DEFAULT nextval('public.customers_id_seq'::regclass);


--
-- Name: products id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public.products_id_seq'::regclass);


--
-- Name: transaction_items id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transaction_items ALTER COLUMN id SET DEFAULT nextval('public.transaction_items_id_seq'::regclass);


--
-- Name: transactions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions ALTER COLUMN id SET DEFAULT nextval('public.transactions_id_seq'::regclass);


--
-- Data for Name: customers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.customers (id, name, email, phone, address, created_at, updated_at, deleted_at) FROM stdin;
4	Andreas	andres@gmail.com	08521317314	st. Johnson. Amerika Serikat	2024-08-24 17:24:08.096261	2024-08-24 17:24:08.096261	\N
5	Customer 1	customer1@example.com	123-456-7891	Address 1	2024-08-24 22:13:22.444305	2024-08-24 22:13:22.444305	\N
6	Customer 2	customer2@example.com	123-456-7892	Address 2	2024-08-24 22:13:22.45206	2024-08-24 22:13:22.45206	2024-08-25 06:45:48.257077
2	John Joe Doel	john.joe@example.com	1234567890	123 Main St, Anytown, AMR	2024-08-23 13:58:51.261105	2024-08-23 13:58:51.261105	2024-08-25 14:44:03.801804
1	John Do	john.doe@example.com	1234567890	123 Main St, Anytown, USA	2024-08-23 13:53:53.561656	2024-08-23 13:53:53.561656	\N
7	Customer 3	customer3@example.com	123-456-7893	Address 3	2024-08-24 22:13:22.45359	2024-08-24 22:13:22.45359	\N
8	Customer 4	customer4@example.com	123-456-7894	Address 4	2024-08-24 22:13:22.45471	2024-08-24 22:13:22.45471	\N
9	Customer 5	customer5@example.com	123-456-7895	Address 5	2024-08-24 22:13:22.458278	2024-08-24 22:13:22.458278	\N
10	Customer 6	customer6@example.com	123-456-7896	Address 6	2024-08-24 22:13:22.459708	2024-08-24 22:13:22.459708	\N
12	Customer 8	customer8@example.com	123-456-7898	Address 8	2024-08-24 22:13:22.462151	2024-08-24 22:13:22.462151	\N
13	Customer 9	customer9@example.com	123-456-7899	Address 9	2024-08-24 22:13:22.463577	2024-08-24 22:13:22.463577	\N
14	Customer 10	customer10@example.com	123-456-7890	Address 10	2024-08-24 22:13:22.4651	2024-08-24 22:13:22.4651	\N
15	Customer 11	customer11@example.com	123-456-7891	Address 11	2024-08-24 22:13:22.466104	2024-08-24 22:13:22.466104	\N
16	Customer 12	customer12@example.com	123-456-7892	Address 12	2024-08-24 22:13:22.466995	2024-08-24 22:13:22.466995	\N
17	Customer 13	customer13@example.com	123-456-7893	Address 13	2024-08-24 22:13:22.468118	2024-08-24 22:13:22.468118	\N
18	Customer 14	customer14@example.com	123-456-7894	Address 14	2024-08-24 22:13:22.469155	2024-08-24 22:13:22.469155	\N
19	Customer 15	customer15@example.com	123-456-7895	Address 15	2024-08-24 22:13:22.470068	2024-08-24 22:13:22.470068	\N
20	Customer 16	customer16@example.com	123-456-7896	Address 16	2024-08-24 22:13:22.471176	2024-08-24 22:13:22.471176	\N
21	Customer 17	customer17@example.com	123-456-7897	Address 17	2024-08-24 22:13:22.473398	2024-08-24 22:13:22.473398	\N
22	Customer 18	customer18@example.com	123-456-7898	Address 18	2024-08-24 22:13:22.475321	2024-08-24 22:13:22.475321	\N
23	Customer 19	customer19@example.com	123-456-7899	Address 19	2024-08-24 22:13:22.476352	2024-08-24 22:13:22.476352	\N
24	Customer 20	customer20@example.com	123-456-7890	Address 20	2024-08-24 22:13:22.477254	2024-08-24 22:13:22.477254	\N
25	Customer 21	customer21@example.com	123-456-7891	Address 21	2024-08-24 22:13:22.478079	2024-08-24 22:13:22.478079	\N
26	Customer 22	customer22@example.com	123-456-7892	Address 22	2024-08-24 22:13:22.479014	2024-08-24 22:13:22.479014	\N
27	Customer 23	customer23@example.com	123-456-7893	Address 23	2024-08-24 22:13:22.480003	2024-08-24 22:13:22.480003	\N
28	Customer 24	customer24@example.com	123-456-7894	Address 24	2024-08-24 22:13:22.480999	2024-08-24 22:13:22.480999	\N
29	Customer 25	customer25@example.com	123-456-7895	Address 25	2024-08-24 22:13:22.482938	2024-08-24 22:13:22.482938	\N
30	Customer 26	customer26@example.com	123-456-7896	Address 26	2024-08-24 22:13:22.483948	2024-08-24 22:13:22.483948	\N
31	Customer 27	customer27@example.com	123-456-7897	Address 27	2024-08-24 22:13:22.484841	2024-08-24 22:13:22.484841	\N
32	Customer 28	customer28@example.com	123-456-7898	Address 28	2024-08-24 22:13:22.485689	2024-08-24 22:13:22.485689	\N
33	Customer 29	customer29@example.com	123-456-7899	Address 29	2024-08-24 22:13:22.486875	2024-08-24 22:13:22.486875	\N
34	Customer 30	customer30@example.com	123-456-7890	Address 30	2024-08-24 22:13:22.488118	2024-08-24 22:13:22.488118	\N
35	Customer 31	customer31@example.com	123-456-7891	Address 31	2024-08-24 22:13:22.491843	2024-08-24 22:13:22.491843	\N
36	Customer 32	customer32@example.com	123-456-7892	Address 32	2024-08-24 22:13:22.492846	2024-08-24 22:13:22.492846	\N
37	Customer 33	customer33@example.com	123-456-7893	Address 33	2024-08-24 22:13:22.493897	2024-08-24 22:13:22.493897	\N
38	Customer 34	customer34@example.com	123-456-7894	Address 34	2024-08-24 22:13:22.494753	2024-08-24 22:13:22.494753	\N
39	Customer 35	customer35@example.com	123-456-7895	Address 35	2024-08-24 22:13:22.496781	2024-08-24 22:13:22.496781	\N
40	Customer 36	customer36@example.com	123-456-7896	Address 36	2024-08-24 22:13:22.501142	2024-08-24 22:13:22.501142	\N
41	Customer 37	customer37@example.com	123-456-7897	Address 37	2024-08-24 22:13:22.502916	2024-08-24 22:13:22.502916	\N
42	Customer 38	customer38@example.com	123-456-7898	Address 38	2024-08-24 22:13:22.504427	2024-08-24 22:13:22.504427	\N
43	Customer 39	customer39@example.com	123-456-7899	Address 39	2024-08-24 22:13:22.506792	2024-08-24 22:13:22.506792	\N
44	Customer 40	customer40@example.com	123-456-7890	Address 40	2024-08-24 22:13:22.507919	2024-08-24 22:13:22.507919	\N
45	Customer 41	customer41@example.com	123-456-7891	Address 41	2024-08-24 22:13:22.508911	2024-08-24 22:13:22.508911	\N
46	Customer 42	customer42@example.com	123-456-7892	Address 42	2024-08-24 22:13:22.509717	2024-08-24 22:13:22.509717	\N
47	Customer 43	customer43@example.com	123-456-7893	Address 43	2024-08-24 22:13:22.510764	2024-08-24 22:13:22.510764	\N
48	Customer 44	customer44@example.com	123-456-7894	Address 44	2024-08-24 22:13:22.511675	2024-08-24 22:13:22.511675	\N
49	Customer 45	customer45@example.com	123-456-7895	Address 45	2024-08-24 22:13:22.513007	2024-08-24 22:13:22.513007	\N
50	Customer 46	customer46@example.com	123-456-7896	Address 46	2024-08-24 22:13:22.513947	2024-08-24 22:13:22.513947	\N
51	Customer 47	customer47@example.com	123-456-7897	Address 47	2024-08-24 22:13:22.515155	2024-08-24 22:13:22.515155	\N
52	Customer 48	customer48@example.com	123-456-7898	Address 48	2024-08-24 22:13:22.516072	2024-08-24 22:13:22.516072	\N
53	Customer 49	customer49@example.com	123-456-7899	Address 49	2024-08-24 22:13:22.517934	2024-08-24 22:13:22.517934	\N
54	Customer 50	customer50@example.com	123-456-7890	Address 50	2024-08-24 22:13:22.518848	2024-08-24 22:13:22.518848	\N
55	Customer 51	customer51@example.com	123-456-7891	Address 51	2024-08-24 22:13:22.51969	2024-08-24 22:13:22.51969	\N
56	Customer 52	customer52@example.com	123-456-7892	Address 52	2024-08-24 22:13:22.520604	2024-08-24 22:13:22.520604	\N
57	Customer 53	customer53@example.com	123-456-7893	Address 53	2024-08-24 22:13:22.521703	2024-08-24 22:13:22.521703	\N
58	Customer 54	customer54@example.com	123-456-7894	Address 54	2024-08-24 22:13:22.52465	2024-08-24 22:13:22.52465	\N
59	Customer 55	customer55@example.com	123-456-7895	Address 55	2024-08-24 22:13:22.525938	2024-08-24 22:13:22.525938	\N
60	Customer 56	customer56@example.com	123-456-7896	Address 56	2024-08-24 22:13:22.527028	2024-08-24 22:13:22.527028	\N
61	Customer 57	customer57@example.com	123-456-7897	Address 57	2024-08-24 22:13:22.527958	2024-08-24 22:13:22.527958	\N
62	Customer 58	customer58@example.com	123-456-7898	Address 58	2024-08-24 22:13:22.530533	2024-08-24 22:13:22.530533	\N
63	Customer 59	customer59@example.com	123-456-7899	Address 59	2024-08-24 22:13:22.531618	2024-08-24 22:13:22.531618	\N
64	Customer 60	customer60@example.com	123-456-7890	Address 60	2024-08-24 22:13:22.532585	2024-08-24 22:13:22.532585	\N
65	Customer 61	customer61@example.com	123-456-7891	Address 61	2024-08-24 22:13:22.533594	2024-08-24 22:13:22.533594	\N
66	Customer 62	customer62@example.com	123-456-7892	Address 62	2024-08-24 22:13:22.534453	2024-08-24 22:13:22.534453	\N
67	Customer 63	customer63@example.com	123-456-7893	Address 63	2024-08-24 22:13:22.535359	2024-08-24 22:13:22.535359	\N
68	Customer 64	customer64@example.com	123-456-7894	Address 64	2024-08-24 22:13:22.536398	2024-08-24 22:13:22.536398	\N
69	Customer 65	customer65@example.com	123-456-7895	Address 65	2024-08-24 22:13:22.537646	2024-08-24 22:13:22.537646	\N
70	Customer 66	customer66@example.com	123-456-7896	Address 66	2024-08-24 22:13:22.53848	2024-08-24 22:13:22.53848	\N
71	Customer 67	customer67@example.com	123-456-7897	Address 67	2024-08-24 22:13:22.539977	2024-08-24 22:13:22.539977	\N
72	Customer 68	customer68@example.com	123-456-7898	Address 68	2024-08-24 22:13:22.541436	2024-08-24 22:13:22.541436	\N
73	Customer 69	customer69@example.com	123-456-7899	Address 69	2024-08-24 22:13:22.544054	2024-08-24 22:13:22.544054	\N
74	Customer 70	customer70@example.com	123-456-7890	Address 70	2024-08-24 22:13:22.544989	2024-08-24 22:13:22.544989	\N
75	Customer 71	customer71@example.com	123-456-7891	Address 71	2024-08-24 22:13:22.545944	2024-08-24 22:13:22.545944	\N
76	Customer 72	customer72@example.com	123-456-7892	Address 72	2024-08-24 22:13:22.54692	2024-08-24 22:13:22.54692	\N
77	Customer 73	customer73@example.com	123-456-7893	Address 73	2024-08-24 22:13:22.548056	2024-08-24 22:13:22.548056	\N
78	Customer 74	customer74@example.com	123-456-7894	Address 74	2024-08-24 22:13:22.55074	2024-08-24 22:13:22.55074	\N
79	Customer 75	customer75@example.com	123-456-7895	Address 75	2024-08-24 22:13:22.551746	2024-08-24 22:13:22.551746	\N
80	Customer 76	customer76@example.com	123-456-7896	Address 76	2024-08-24 22:13:22.55265	2024-08-24 22:13:22.55265	\N
81	Customer 77	customer77@example.com	123-456-7897	Address 77	2024-08-24 22:13:22.553472	2024-08-24 22:13:22.553472	\N
82	Customer 78	customer78@example.com	123-456-7898	Address 78	2024-08-24 22:13:22.554409	2024-08-24 22:13:22.554409	\N
83	Customer 79	customer79@example.com	123-456-7899	Address 79	2024-08-24 22:13:22.55623	2024-08-24 22:13:22.55623	\N
84	Customer 80	customer80@example.com	123-456-7890	Address 80	2024-08-24 22:13:22.557321	2024-08-24 22:13:22.557321	\N
85	Customer 81	customer81@example.com	123-456-7891	Address 81	2024-08-24 22:13:22.558242	2024-08-24 22:13:22.558242	\N
86	Customer 82	customer82@example.com	123-456-7892	Address 82	2024-08-24 22:13:22.559745	2024-08-24 22:13:22.559745	\N
87	Customer 83	customer83@example.com	123-456-7893	Address 83	2024-08-24 22:13:22.561471	2024-08-24 22:13:22.561471	\N
88	Customer 84	customer84@example.com	123-456-7894	Address 84	2024-08-24 22:13:22.562273	2024-08-24 22:13:22.562273	\N
89	Customer 85	customer85@example.com	123-456-7895	Address 85	2024-08-24 22:13:22.563847	2024-08-24 22:13:22.563847	\N
90	Customer 86	customer86@example.com	123-456-7896	Address 86	2024-08-24 22:13:22.564884	2024-08-24 22:13:22.564884	\N
91	Customer 87	customer87@example.com	123-456-7897	Address 87	2024-08-24 22:13:22.565651	2024-08-24 22:13:22.565651	\N
92	Customer 88	customer88@example.com	123-456-7898	Address 88	2024-08-24 22:13:22.567677	2024-08-24 22:13:22.567677	\N
93	Customer 89	customer89@example.com	123-456-7899	Address 89	2024-08-24 22:13:22.568467	2024-08-24 22:13:22.568467	\N
94	Customer 90	customer90@example.com	123-456-7890	Address 90	2024-08-24 22:13:22.570665	2024-08-24 22:13:22.570665	\N
95	Customer 91	customer91@example.com	123-456-7891	Address 91	2024-08-24 22:13:22.576517	2024-08-24 22:13:22.576517	\N
96	Customer 92	customer92@example.com	123-456-7892	Address 92	2024-08-24 22:13:22.577446	2024-08-24 22:13:22.577446	\N
97	Customer 93	customer93@example.com	123-456-7893	Address 93	2024-08-24 22:13:22.57998	2024-08-24 22:13:22.57998	\N
98	Customer 94	customer94@example.com	123-456-7894	Address 94	2024-08-24 22:13:22.583599	2024-08-24 22:13:22.583599	\N
99	Customer 95	customer95@example.com	123-456-7895	Address 95	2024-08-24 22:13:22.584658	2024-08-24 22:13:22.584658	\N
100	Customer 96	customer96@example.com	123-456-7896	Address 96	2024-08-24 22:13:22.585648	2024-08-24 22:13:22.585648	\N
101	Customer 97	customer97@example.com	123-456-7897	Address 97	2024-08-24 22:13:22.586612	2024-08-24 22:13:22.586612	\N
102	Customer 98	customer98@example.com	123-456-7898	Address 98	2024-08-24 22:13:22.587493	2024-08-24 22:13:22.587493	\N
107	John Hoe	john.e@example.com	1234567890	123 Main St, Anytown, AMR	2024-08-25 14:39:13.680851	2024-08-25 14:39:13.680851	\N
110	John	john@example.com	1234567890	123 Main St, Anytown, AMR	2024-08-25 14:41:51.15902	2024-08-25 14:41:51.15902	\N
112	John	joh@example.com	1234567890	123 Main St, Anytown, AMR	2024-08-25 14:52:18.103835	2024-08-25 14:52:18.103835	\N
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products (id, name, price, stock, created_at, updated_at) FROM stdin;
2	Product 2	10000.00	75	2024-08-23 13:41:17.178404	2024-08-23 13:41:17.178404
3	Product 3	20000.00	50	2024-08-23 13:41:17.197077	2024-08-23 13:41:17.197077
7	Product 7	100000.00	20	2024-08-23 13:41:17.293726	2024-08-23 13:41:17.293726
8	Product 8	30000.00	30	2024-08-23 13:41:17.312817	2024-08-23 13:41:17.312817
1	Lemari Kayu	500000.00	100	2024-08-23 13:41:16.995256	2024-08-25 13:31:48.19758
17	Laptop	400000.00	30	2024-08-25 13:47:43.577938	2024-08-25 13:47:43.577938
16	Monitor baru	30000.00	30	2024-08-25 13:44:07.135845	2024-08-25 13:49:11.92917
18	Mouse	30000.00	40	2024-08-25 13:50:13.27504	2024-08-25 13:50:13.27504
19	Stop Kontak	20000.00	20	2024-08-25 13:52:32.350457	2024-08-25 13:52:32.350457
20	product baru	5000.00	30	2024-08-25 14:44:58.610227	2024-08-25 14:44:58.610227
\.


--
-- Data for Name: transaction_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.transaction_items (id, transaction_id, product_id, quantity, price) FROM stdin;
13	9	1	100	5000.00
16	10	2	5	10000.00
18	12	3	10	20000.00
25	19	3	10	20000.00
\.


--
-- Data for Name: transactions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.transactions (id, customer_id, total_amount, payment_status, created_at, updated_at) FROM stdin;
19	5	450000.00	PENDING	2024-08-25 14:38:02.789118	2024-08-25 14:38:02.789118
12	1	2200000.00	SUCCESS	2024-08-25 13:41:19.584879	2024-08-25 14:46:28.835106
9	1	700000.00	PENDING	2024-08-25 12:27:07.513138	2024-08-25 13:07:44.918105
10	2	70000.00	PENDING	2024-08-25 12:28:46.334813	2024-08-25 13:13:04.807882
\.


--
-- Name: customers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.customers_id_seq', 112, true);


--
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.products_id_seq', 20, true);


--
-- Name: transaction_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.transaction_items_id_seq', 26, true);


--
-- Name: transactions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.transactions_id_seq', 19, true);


--
-- Name: customers customers_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_email_key UNIQUE (email);


--
-- Name: customers customers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_pkey PRIMARY KEY (id);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: transaction_items transaction_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transaction_items
    ADD CONSTRAINT transaction_items_pkey PRIMARY KEY (id);


--
-- Name: transactions transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_pkey PRIMARY KEY (id);


--
-- Name: transaction_items transaction_items_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transaction_items
    ADD CONSTRAINT transaction_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: transaction_items transaction_items_transaction_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transaction_items
    ADD CONSTRAINT transaction_items_transaction_id_fkey FOREIGN KEY (transaction_id) REFERENCES public.transactions(id);


--
-- Name: transactions transactions_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id);


--
-- PostgreSQL database dump complete
--

