CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS messengers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    curator_id UUID REFERENCES curators(id) ON DELETE CASCADE,
    messenger VARCHAR(20) NOT NULL,
    nickname VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CHECK (
        messenger IN ('telegram', 'whatsapp', 'vk')
    )
);