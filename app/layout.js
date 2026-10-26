import Link from 'next/link';

export const metadata = {
  title: 'Sistema de Seguros de Accidentes Personales',
  description: 'Trabajo Integrador ISFT N.º 199',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body style={{ margin: 0, fontFamily: 'sans-serif', background: '#f4f6f8' }}>
        {/* Barra de Menú Obligatoria */}
        <nav style={{ background: '#1f2937', color: '#fff', padding: '15px 30px', display: 'flex', gap: '25px', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '18px' }}>Seguros App</h3>
          <Link href="/" style={{ color: '#fff', textDecoration: 'none' }}>INICIO / DASHBOARD</Link>
          <Link href="/clientes" style={{ color: '#fff', textDecoration: 'none' }}>CLIENTES</Link>
          <Link href="/polizas" style={{ color: '#fff', textDecoration: 'none' }}>PÓLIZAS</Link>
          <Link href="/siniestros" style={{ color: '#fff', textDecoration: 'none' }}>SINIESTROS</Link>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  );
}