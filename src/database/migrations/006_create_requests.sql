CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    contact VARCHAR(50) NOT NULL,
    by_phone BOOLEAN DEFAULT false,
    on_messenger BOOLEAN DEFAULT false,
    pet_id UUID REFERENCES pets(id) ON DELETE CASCADE,
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CHECK (
        pet_id IS NOT NULL
        OR comment IS NOT NULL
    )
);