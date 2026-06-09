CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS curators (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    last_name VARCHAR(50) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    middle_name VARCHAR(50),
    description TEXT,
    image TEXT,
    birthday DATE,
    phone_number VARCHAR(20) UNIQUE NOT NULL,
    nickname VARCHAR(30) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);