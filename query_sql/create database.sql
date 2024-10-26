DROP DATABASE face_service_app_db;

-- Tạo database face-service-app-db
CREATE DATABASE face_service_app_db;

-- Sử dụng database face-service-app-db
USE face_service_app_db;

-- create tables

CREATE TABLE users (
    id INT,
    username VARCHAR(50) CHARACTER SET UTF8MB4,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    birthday DATETIME, 
    face_embed_id INT,
    constraint pk_user primary key (id)
);
CREATE TABLE user_face_img (
	id INT, 
    img_url VARCHAR(100),
    user_id INT,
    constraint pk_user_face_img primary key (id)
);
CREATE TABLE features (
	id INT,
    embed BLOB, 
    img_id INT,
    constraint pk_features primary key (id)
);
CREATE TABLE api_face_img (
	id INT, 
    img_url VARCHAR(100),
    person_id INT 
);
CREATE TABLE person (
	id INT, 
    person_name VARCHAR(50) CHARACTER SET UTF8MB4 NOT NULL,
    birthday DATETIME,
    nationality VARCHAR(50), 
    collection_id INT,
    constraint pk_person primary key (id)
);
CREATE TABLE collection (
	id INT,
    collection_name VARCHAR(50) CHARACTER SET UTF8MB4 NOT NULL,
    colleciton_description VARCHAR(20access_collection0) CHARACTER SET UTF8MB4,
    constraint pk_collection primary key (id)
);
CREATE TABLE user_key (
	user_id INT,
    api_key_id INT,
    constraint pk_user_key primary key (user_id, api_key_id)
);
CREATE TABLE api_key (
	id INT,
    api_key VARCHAR(20),
	admin_key_id INT,
    constraint pk_api_key primary key (id)
);
CREATE TABLE access_collection (
	collection_id INT,
    api_key_id INT,
    constraint pk_access_collection primary key (collection_id, api_key_id)
);

-- set up foreign key
-- user_key (user id) -> users(id)
ALTER TABLE user_key
ADD CONSTRAINT fk_user_key_user
FOREIGN KEY (user_id)
REFERENCES users(id);

-- api_key(admin_key_id)->api_key (id)
ALTER TABLE api_key
ADD CONSTRAINT fk_api_key_api_key
FOREIGN KEY (admin_key_id)
REFERENCES api_key (id);

-- access_collection(api_key_id) -->api_key(id)
ALTER TABLE access_collection
ADD CONSTRAINT fk_access_collection_api_key
FOREIGN KEY (api_key_id)
REFERENCES api_key(id);

-- access_collection(collection_id) --> collection(id)
ALTER TABLE access_collection
ADD CONSTRAINT fk_access_collection_collection
FOREIGN KEY (collection_id)
REFERENCES collection(id);

-- users(face_embed_id) --> features(id)
ALTER TABLE users
ADD CONSTRAINT fk_users_features
FOREIGN KEY (face_embed_id)
REFERENCES features(id);

-- user_face_img(user_id) --> users(id)
ALTER TABLE user_face_img
ADD CONSTRAINT fk_user_face_img_users
FOREIGN KEY (user_id)
REFERENCES users(id);

-- person (collection_id) --> collection(id)
ALTER TABLE person
ADD CONSTRAINT fk_person_collection
FOREIGN KEY (collection_id)
REFERENCES collection(id);

-- api_face_img (person_id) -->person(id)
ALTER TABLE api_face_img
ADD CONSTRAINT fk_api_face_img_person
FOREIGN KEY (person_id)
REFERENCES person(id);

