CREATE TYPE user_type_enum AS ENUM ('admin', 'supplier', 'customer');


CREATE TABLE IF NOT EXISTS users {
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_type_enum NOT NULL DEFAULT 'customer',
    role_id uuid REFERENCES roles(id) ON DELETE SET NULL,
    organization_id uuid REFERENCES organizations(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    name VARCHAR(255),
    phone VARCHAR(20),
};

CREATE INDEX idx_users_email ON users(email);

CREATE TABLE IF NOT EXISTS organizations {
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) UNIQUE NOT NULL,
    diplay_name VARCHAR(255),
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
};


