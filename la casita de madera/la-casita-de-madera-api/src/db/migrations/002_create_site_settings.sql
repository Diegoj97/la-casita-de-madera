CREATE TABLE IF NOT EXISTS site_settings (
  key         TEXT PRIMARY KEY,
  value       TEXT NOT NULL,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO site_settings (key, value)
VALUES ('background_url', '')
ON CONFLICT (key) DO NOTHING;
