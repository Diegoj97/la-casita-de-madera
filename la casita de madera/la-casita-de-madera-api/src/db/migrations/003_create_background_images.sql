CREATE TABLE IF NOT EXISTS background_images (
  id         SERIAL PRIMARY KEY,
  filename   TEXT NOT NULL,
  url        TEXT NOT NULL,
  label      TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
