INSERT INTO site_settings (key, value)
VALUES
  ('home_title', 'Bienvenidos a Nuestro Mundo de Abejas'),
  ('home_subtitle', 'Pasión por la apicultura y el cuidado de la naturaleza'),
  ('about_title', 'Conoce a Sergio Castañeira, Tu Apicultor Local'),
  ('about_text', 'Con años de experiencia en el cuidado de las abejas, Sergio Castañeira se dedica a la apicultura sostenible. Nuestro objetivo es ofrecer la mejor miel artesanal mientras protegemos el ecosistema y fomentamos la biodiversidad local.'),
  ('about_excerpt', 'Con años de experiencia en el cuidado de las abejas, Sergio Castañeira se dedica a la apicultura sostenible. Nuestro objetivo es ofrecer la mejor miel artesanal mientras protegemos el ecosistema y fomentamos la biodiversidad local.'),
  ('about_image_url', ''),
  ('colmenar_text', 'Nuestro colmenar está situado en un entorno privilegiado, rodeado de naturaleza y biodiversidad. Las abejas recogen el néctar de flores silvestres, eucaliptos y bosques autóctonos, lo que da a nuestra miel un sabor único y característico.

Trabajamos con métodos tradicionales respetuosos con las abejas, priorizando su bienestar y la calidad del producto final. Cada tarro de miel que llega a tus manos es el resultado de un proceso artesanal y sostenible.'),
  ('quienes_title', 'Conoce a Sergio Castañeira, Tu Apicultor Local'),
  ('quienes_text', 'Con años de experiencia en el cuidado de las abejas, Sergio Castañeira se dedica a la apicultura sostenible. Nuestro objetivo es ofrecer la mejor miel artesanal mientras protegemos el ecosistema y fomentamos la biodiversidad local.

Cada colmena es un mundo y cada cosecha cuenta una historia. Trabajamos con respeto por la naturaleza, asegurando que nuestras abejas tengan un entorno saludable y libre de químicos. La miel que producimos es 100% natural, sin aditivos ni procesos artificiales.

Te invitamos a conocer nuestro colmenar y descubrir el fascinante mundo de las abejas.'),
  ('quienes_image_url', ''),
  ('background_url', 'https://res.cloudinary.com/llj5v8cv/image/upload/v1784298974/la-casita-de-madera/backgrounds/bg-4.jpg')
ON CONFLICT (key) DO NOTHING;
