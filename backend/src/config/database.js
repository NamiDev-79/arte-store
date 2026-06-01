const mysql = require('mysql2/promise');

// Railway exposes MYSQL_URL (or DATABASE_URL) as a full connection string.
// Falls back to individual DB_* variables for local dev.
const connectionConfig = process.env.MYSQL_URL || process.env.DATABASE_URL
  ? { uri: process.env.MYSQL_URL || process.env.DATABASE_URL }
  : {
      host:     process.env.MYSQLHOST     || process.env.DB_HOST     || 'localhost',
      port:     process.env.MYSQLPORT     || process.env.DB_PORT     || 3306,
      user:     process.env.MYSQLUSER     || process.env.DB_USER     || 'root',
      password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD || '',
      database: process.env.MYSQLDATABASE || process.env.DB_NAME     || 'arte_store',
    };

const pool = mysql.createPool({
  ...connectionConfig,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
});

const initDB = async () => {
  try {
    const conn = await pool.getConnection();

    await conn.execute(`
      CREATE TABLE IF NOT EXISTS products (
        id          INT AUTO_INCREMENT PRIMARY KEY,
        name        VARCHAR(255)   NOT NULL,
        description TEXT,
        price       DECIMAL(10,2)  NOT NULL,
        stock       INT            NOT NULL DEFAULT 0,
        image_url   VARCHAR(1024),
        category    VARCHAR(100),
        artist      VARCHAR(255),
        created_at  TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
        updated_at  TIMESTAMP      DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    /* Seed demo data only if the table is empty */
    const [rows] = await conn.execute('SELECT COUNT(*) AS cnt FROM products');
    if (rows[0].cnt === 0) {
      const seeds = [
        ['Óleo sobre lienzo – Atardecer', 'Pintura al óleo de gran formato que captura los tonos dorados de un atardecer mediterráneo.', 1200.00, 1, 'https://picsum.photos/seed/oleo/600/400', 'Pintura', 'María Torres'],
        ['Escultura en bronce – Figura abstracta', 'Pieza escultórica de 45 cm fundida en bronce siguiendo la técnica tradicional de la cera perdida.', 3500.00, 2, 'https://picsum.photos/seed/escultura/600/400', 'Escultura', 'Carlos Méndez'],
        ['Acuarela – Jardín botánico', 'Serie de acuarelas botánicas de alta precisión, ilustrando flora nativa en papel de algodón 300 g.', 450.00, 5, 'https://picsum.photos/seed/acuarela/600/400', 'Acuarela', 'Lucía Ramos'],
        ['Fotografía artística – Ciudad nocturna', 'Impresión giclée de edición limitada (10 ejemplares) sobre papel baritado, firmada y numerada.', 800.00, 3, 'https://picsum.photos/seed/foto/600/400', 'Fotografía', 'Andrés Vega'],
        ['Cerámica artesanal – Jarrón raku', 'Jarrón de cerámica elaborado con técnica raku japonesa, cada pieza es única e irrepetible.', 650.00, 4, 'https://picsum.photos/seed/ceramica/600/400', 'Cerámica', 'Sofia Castillo'],
      ];
      for (const [name, description, price, stock, image_url, category, artist] of seeds) {
        await conn.execute(
          'INSERT INTO products (name, description, price, stock, image_url, category, artist) VALUES (?,?,?,?,?,?,?)',
          [name, description, price, stock, image_url, category, artist]
        );
      }
      console.log('✅  Demo products seeded');
    }

    conn.release();
    console.log('✅  Database initialized');
  } catch (err) {
    console.error('❌  Database initialization error:', err.message);
    throw err;
  }
};

module.exports = { pool, initDB };
