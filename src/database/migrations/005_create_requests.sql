CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DO $$
BEGIN
    CREATE TYPE request_status AS ENUM (
        'новый',
        'в работе',
        'успешно завершено',
        'в архиве'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    status request_status NOT NULL DEFAULT 'новый',
    curator_id UUID
        REFERENCES curators(id)
        ON DELETE CASCADE,
    pet_id UUID
        REFERENCES pets(id)
        ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    contact VARCHAR(255) NOT NULL,
    by_phone BOOLEAN DEFAULT false,
    on_messenger BOOLEAN DEFAULT false,
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CHECK (
        pet_id IS NOT NULL
        OR length(trim(comment)) > 0
    ),
    CHECK (
        by_phone = true
        OR on_messenger = true
    )
);