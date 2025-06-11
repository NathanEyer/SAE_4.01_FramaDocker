-- Table des sondages
CREATE TABLE polls (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    admin_email VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des options de dates
CREATE TABLE poll_options (
    id SERIAL PRIMARY KEY,
    poll_id INTEGER REFERENCES polls(id) ON DELETE CASCADE,
    date_option VARCHAR(100) NOT NULL
);

-- Table des votes
CREATE TABLE votes (
    id SERIAL PRIMARY KEY,
    poll_id INTEGER REFERENCES polls(id) ON DELETE CASCADE,
    participant_name VARCHAR(100) NOT NULL,
    option_id INTEGER REFERENCES poll_options(id) ON DELETE CASCADE,
    vote VARCHAR(10) CHECK (vote IN ('yes', 'no', 'maybe'))
);
