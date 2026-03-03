CREATE TABLE organizations (
    organization_id BIGSERIAL PRIMARY KEY,
    organization_name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE colleges (
    college_id BIGSERIAL PRIMARY KEY,
    college_name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE branches (
    branch_id BIGSERIAL PRIMARY KEY,
    college_id BIGINT NOT NULL,
    branch_name TEXT NOT NULL,
    FOREIGN KEY (college_id) REFERENCES colleges(college_id)
);

CREATE TABLE sections (
    section_id BIGSERIAL PRIMARY KEY,
    branch_id BIGINT NOT NULL,
    section_name VARCHAR(255) NOT NULL,
    class_pic_final TEXT,
    strength INT NOT NULL,
    FOREIGN KEY (branch_id) REFERENCES branches(branch_id)
);

CREATE TABLE users (
    user_id BIGSERIAL PRIMARY KEY,
    section_id BIGINT NOT NULL,
    mobile VARCHAR(15) NOT NULL,
    email VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    visibility VARCHAR(50) DEFAULT 'non_anonymous',
    profile_pic TEXT,
    know_me TEXT,
    qr_code TEXT,
    class_img TEXT,
    t_shirt_size_preference VARCHAR(10),
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (section_id) REFERENCES sections(section_id)
);

CREATE TABLE votes (
    vote_id BIGSERIAL PRIMARY KEY,
    voter_id BIGINT NOT NULL,
    voted_for BIGINT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (voter_id) REFERENCES users(user_id),
    FOREIGN KEY (voted_for) REFERENCES users(user_id)
);

CREATE TABLE followers (
    id BIGSERIAL PRIMARY KEY,
    followee BIGINT NOT NULL,
    follower BIGINT NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (followee) REFERENCES users(user_id),
    FOREIGN KEY (follower) REFERENCES users(user_id)
);

CREATE TABLE payments (
    payment_id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    amount NUMERIC(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    provider_ref TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE main_t_shirts (
    main_t_shirt_id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    payment_id BIGINT,
    size VARCHAR(10) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (payment_id) REFERENCES payments(payment_id)
);

CREATE TABLE personal_shirts (
    personal_t_shirt_id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    payment_id BIGINT,
    status VARCHAR(50) DEFAULT 'pending',
    nft TEXT,
    grafic_img TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (payment_id) REFERENCES payments(payment_id)
);

CREATE TABLE slam_books (
    slam_book_id BIGSERIAL PRIMARY KEY,
    owner_id BIGINT NOT NULL,
    payment_id BIGINT,
    pdf_url TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(user_id),
    FOREIGN KEY (payment_id) REFERENCES payments(payment_id)
);

CREATE TABLE signatures (
    sign_id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    sticker TEXT,
    quote VARCHAR(255) NOT NULL,
    author BIGINT,
    message TEXT,
    type VARCHAR(50) DEFAULT 'anonymous',
    media_file TEXT,
    in_book BOOLEAN DEFAULT FALSE,
    signed_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    viewed BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (author) REFERENCES users(user_id)
);