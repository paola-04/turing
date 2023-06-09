DROP TABLE IF EXISTS roles CASCADE;
create table roles(
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR (180) NOT NULL UNIQUE,
    image VARCHAR(255) NULL,
    route VARCHAR(255) NULL,
    created_at TIMESTAMP(0) NOT NULL,
	updated_at TIMESTAMP(0) NOT NULL
)

insert into roles(
    name,
    route,
    created_at,
    updated_at
) values(
    'user',
    'user/home',
    '2023-06-06',
    '2023-06-06'
);
insert into roles(
    name,
    route,
    created_at,
    updated_at
) values(
    'Admin',
    'admin/home',
    '2023-06-06',
    '2023-06-06'
);

DROP TABLE IF EXISTS users CASCADE;
create table users(
	id BIGSERIAL PRIMARY KEY,
    id_rol BIGSERIAL NOT NULL,
	matricula VARCHAR(255) NOT NULL UNIQUE,
	name VARCHAR(255) NOT NULL,
	lastname VARCHAR(255) NOT NULL,
	phone VARCHAR(80) NOT NULL UNIQUE,
	image VARCHAR(255) NULL,
	password VARCHAR(255) NOT NULL,
	is_available BOOLEAN NULL,
	session_token VARCHAR(255) NULL,
	created_at TIMESTAMP(0) NOT NULL,
	updated_at TIMESTAMP(0) NOT NULL,
    identifier VARCHAR(255) UNIQUE,
    FOREIGN KEY(id_rol) REFERENCES roles(id) ON UPDATE CASCADE ON DELETE CASCADE
);

DROP TABLE IF EXISTS categories CASCADE;
create table categories(
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description VARCHAR(255) NOT NULL,
    created_at TIMESTAMP(0) NOT NULL,
	updated_at TIMESTAMP(0) NOT NULL
);

DROP TABLE IF EXISTS evento CASCADE;
create table eventos(
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description VARCHAR(255) NOT NULL,
    image1 VARCHAR(255) NULL,
    image2 VARCHAR(255) NULL,
    image3 VARCHAR(255) NULL,
    id_category BIGINT NOT NULL,
    created_at TIMESTAMP(0) NOT NULL,
	updated_at TIMESTAMP(0) NOT NULL,
    FOREIGN KEY(id_category) REFERENCES categories(id) ON UPDATE CASCADE ON DELETE CASCADE
);
