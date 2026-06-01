
CREATE DATABASE IF NOT EXISTS arte_store
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE arte_store;

CREATE TABLE IF NOT EXISTS products (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(255)    NOT NULL,
  description TEXT,
  price       DECIMAL(10,2)   NOT NULL,
  stock       INT             NOT NULL DEFAULT 0,
  image_url   VARCHAR(1024),
  category    VARCHAR(100),
  artist      VARCHAR(255),
  created_at  TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP       DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO products (name, description, price, stock, image_url, category, artist) VALUES
('Óleo sobre lienzo – Atardecer', 'Pintura al óleo de gran formato que captura los tonos dorados de un atardecer mediterráneo.', 1200.00, 1, 'https://picsum.photos/seed/oleo/600/400', 'Pintura', 'María Torres'),
('Escultura en bronce – Figura abstracta', 'Pieza escultórica de 45 cm fundida en bronce siguiendo la técnica tradicional de la cera perdida.', 3500.00, 2, 'https://picsum.photos/seed/escultura/600/400', 'Escultura', 'Carlos Méndez'),
('Acuarela – Jardín botánico', 'Serie de acuarelas botánicas de alta precisión, ilustrando flora nativa en papel de algodón 300 g.', 450.00, 5, 'https://picsum.photos/seed/acuarela/600/400', 'Acuarela', 'Lucía Ramos');
