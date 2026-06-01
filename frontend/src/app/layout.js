import './globals.css';

export const metadata = {
  title: 'Arte Store — Galería de Productos Artísticos',
  description: 'Descubre y adquiere obras de arte únicas: pinturas, esculturas, fotografías y más.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <header style={{
          position: 'sticky', top: 0, zIndex: 100,
          background: 'rgba(245,240,232,0.92)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--border)',
          padding: '0 2rem',
        }}>
          <div style={{
            maxWidth: 1200, margin: '0 auto',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            height: 64,
          }}>
            <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 22, letterSpacing: '-0.5px' }}>✦</span>
              <span style={{
                fontFamily: 'var(--font-display)', fontSize: 22,
                fontWeight: 300, letterSpacing: '0.08em',
              }}>ARTE STORE</span>
            </a>
            <nav style={{ display: 'flex', gap: 8 }}>
              <a href="/" style={navLink}>Galería</a>
              <a href="/admin" style={{ ...navLink, ...navPrimary }}>Panel Admin</a>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer style={{
          borderTop: '1px solid var(--border)',
          padding: '2.5rem 2rem',
          textAlign: 'center',
          color: 'var(--warm-gray)',
          fontFamily: 'var(--font-mono)',
          fontSize: 12,
          letterSpacing: '0.05em',
        }}>
          © {new Date().getFullYear()} ARTE STORE — Galería de Productos Artísticos
        </footer>
      </body>
    </html>
  );
}

const navLink = {
  padding: '6px 14px',
  fontFamily: 'var(--font-mono)',
  fontSize: 12,
  letterSpacing: '0.08em',
  color: 'var(--charcoal)',
  borderRadius: 'var(--radius)',
  transition: 'all 0.2s',
};

const navPrimary = {
  background: 'var(--ink)',
  color: 'var(--cream)',
};
