-- CareCircle Database Schema & Trust/Safety Additions

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ENUMS
CREATE TYPE role_type AS ENUM ('family_admin', 'companion', 'platform_admin');
CREATE TYPE visit_status AS ENUM ('pending', 'matched', 'in_route', 'in_progress', 'completed', 'cancelled', 'disputed');
CREATE TYPE background_check_status AS ENUM ('pending', 'clear', 'review', 'failed');
CREATE TYPE idv_status AS ENUM ('pending', 'verified', 'failed');
CREATE TYPE incident_severity AS ENUM ('1_minor', '2_behavioral', '3_safety', '4_emergency');

-- USERS TABLE
CREATE TABLE users (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    role role_type NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE,
    stripe_customer_id VARCHAR(255),
    stripe_account_id VARCHAR(255) -- For companions
);

-- SENIORS TABLE (Managed by Family Admin)
CREATE TABLE seniors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    family_admin_id UUID REFERENCES users(id),
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255),
    date_of_birth DATE,
    address_line_1 VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(50),
    zip VARCHAR(20),
    geo_location GEOGRAPHY(POINT),
    conditions TEXT[], -- e.g., ['dementia_mild', 'mobility_impaired']
    primary_language VARCHAR(50) DEFAULT 'en',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    is_deleted BOOLEAN DEFAULT FALSE -- Soft delete
);

-- COMPANION PROFILES
CREATE TABLE companion_profiles (
    user_id UUID PRIMARY KEY REFERENCES users(id),
    bio TEXT,
    skills TEXT[],
    max_radius_miles INT DEFAULT 20,
    background_status background_check_status DEFAULT 'pending',
    idv_status idv_status DEFAULT 'pending',
    risk_score INT DEFAULT 100, -- 0-100
    average_rating DECIMAL(3,2) DEFAULT 5.00,
    total_visits INT DEFAULT 0,
    -- Certification Compliance
    is_certified BOOLEAN DEFAULT FALSE,
    certification_score INT,
    certification_date TIMESTAMPTZ
);

-- VISITS TABLE
CREATE TABLE visits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    senior_id UUID REFERENCES seniors(id),
    family_admin_id UUID REFERENCES users(id),
    companion_id UUID REFERENCES users(id),
    status visit_status DEFAULT 'pending',
    scheduled_start TIMESTAMPTZ NOT NULL,
    scheduled_end TIMESTAMPTZ NOT NULL,
    actual_start TIMESTAMPTZ,
    actual_end TIMESTAMPTZ,
    visit_type VARCHAR(100),
    base_rate_cents INT NOT NULL,
    platform_fee_cents INT NOT NULL,
    ai_summary TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- VISIT LOGS (Realtime feed)
CREATE TABLE visit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    visit_id UUID REFERENCES visits(id),
    author_id UUID REFERENCES users(id),
    log_type VARCHAR(50), -- 'mood', 'photo', 'note', 'check_in'
    content TEXT,
    media_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- INCIDENTS (Trust & Safety / Emergency Reports)
CREATE TABLE incidents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    visit_id UUID REFERENCES visits(id),
    reporter_id UUID REFERENCES users(id),
    target_id UUID REFERENCES users(id), -- eg companion or senior
    severity incident_severity NOT NULL,
    incident_types TEXT[], -- 'Medical Emergency', 'Physical Abuse', 'Neglect', etc.
    datetime_occurred TIMESTAMPTZ,
    exact_location TEXT,
    was_911_called BOOLEAN DEFAULT FALSE,
    client_transported BOOLEAN DEFAULT FALSE,
    narrative TEXT,
    injuries_observations TEXT,
    aps_reported BOOLEAN DEFAULT FALSE,
    police_reported BOOLEAN DEFAULT FALSE,
    status VARCHAR(50) DEFAULT 'open',
    resolution_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- BACKGROUND CHECK & LEGAL CONSENTS
CREATE TABLE verification_consents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    document_type VARCHAR(50) NOT NULL, -- 'TOS', 'PRIVACY', 'LIABILITY_WAIVER', 'BACKGROUND_CHECK', 'HIPAA'
    policy_version VARCHAR(50),
    ip_address VARCHAR(45),
    digital_signature VARCHAR(255),
    agreed_at TIMESTAMPTZ DEFAULT NOW()
);

-- AUDIT LOG (Immutable)
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_id UUID REFERENCES users(id),
    action VARCHAR(255) NOT NULL,
    target_table VARCHAR(100),
    target_record_id UUID,
    old_data JSONB,
    new_data JSONB,
    ip_address VARCHAR(45),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS POLICIES (Examples)
ALTER TABLE seniors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Families can see their own seniors" ON seniors FOR SELECT USING (family_admin_id = auth.uid());
CREATE POLICY "Admins can see all seniors" ON seniors FOR ALL USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'platform_admin'));

ALTER TABLE visits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Families see their visits" ON visits FOR SELECT USING (family_admin_id = auth.uid());
CREATE POLICY "Companions see their adopted visits" ON visits FOR SELECT USING (companion_id = auth.uid() OR status = 'pending');

-- INDEXES
CREATE INDEX idx_visits_status ON visits(status);
CREATE INDEX idx_visits_companion ON visits(companion_id);
CREATE INDEX idx_logs_visit ON visit_logs(visit_id);
CREATE INDEX idx_seniors_location ON seniors USING GIST (geo_location);
