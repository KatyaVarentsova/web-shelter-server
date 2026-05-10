CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS pets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nickname VARCHAR(50) NOT NULL,
    category VARCHAR(20) NOT NULL
    CHECK (category IN ('Кошка', 'Собака')),
    size INTEGER,
    character VARCHAR(20),
    birthday DATE,
    gender VARCHAR(20)
    CHECK (gender IN ('Мальчик', 'Девочка')),
    wool VARCHAR(20)
    CHECK (wool IN ('Короткая', 'Длинная')),
    for_family BOOLEAN DEFAULT false,
    for_dogs BOOLEAN DEFAULT false,
    for_cats BOOLEAN DEFAULT false,
    is_guest BOOLEAN DEFAULT false,
    description TEXT,
    curator_id UUID REFERENCES curators(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);