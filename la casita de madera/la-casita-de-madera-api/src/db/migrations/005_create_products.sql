CREATE TABLE IF NOT EXISTS products (
  id          SERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  excerpt     TEXT,
  price       REAL,
  image_url   TEXT,
  tags        TEXT DEFAULT '[]',
  images      TEXT DEFAULT '[]',
  available   SMALLINT DEFAULT 1,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_products_slug ON products (slug);
CREATE INDEX IF NOT EXISTS idx_products_available ON products (available);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products (created_at DESC);

INSERT INTO products (name, slug, description, excerpt, price, image_url, tags, available)
VALUES
  (
    'Miel de Flores',
    'miel-de-flores',
    'Nuestra miel de flores se recolecta de las colmenas situadas en los prados silvestres de la sierra. Un sabor suave y dulce, perfecto para el desayuno y para endulzar tus infusiones.',
    'Miel 100% pura de prados silvestres.',
    9.50,
    '/backgrounds/bg-1.jpg',
    '["miel","flores","dulce"]',
    1
  ),
  (
    'Miel de Eucalipto',
    'miel-de-eucalipto',
    'La miel de eucalipto destaca por su color ámbar intenso y sus propiedades balsámicas. Ideal para las vías respiratorias y para quienes buscan un sabor más persistente.',
    'Miel con propiedades balsámicas.',
    10.90,
    '/backgrounds/bg-1.jpg',
    '["miel","eucalipto","balsamico"]',
    1
  ),
  (
    'Miel de Bosque',
    'miel-de-bosque',
    'Obtenida del néctar de los árboles del bosque, esta miel de tonalidad oscura posee un perfil aromático complejo y un toque ligeramente amargo que la hace única.',
    'Miel de bosque de sabor intenso.',
    11.50,
    '/backgrounds/bg-1.jpg',
    '["miel","bosque","intenso"]',
    1
  );
