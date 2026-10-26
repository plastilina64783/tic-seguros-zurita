import db from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Indicadores obligatorios basados en consultas SQL directas
    const totalClientes = db.prepare('SELECT COUNT(*) as count FROM cliente').get().count;
    const polizasActivas = db.prepare("SELECT COUNT(*) as count FROM poliza WHERE estado = 'ACTIVA'").get().count;
    const siniestrosAbiertos = db.prepare("SELECT COUNT(*) as count FROM siniestro WHERE estado IN ('REPORTADO', 'EN_REVISION')").get().count;
    const siniestrosCerrados = db.prepare("SELECT COUNT(*) as count FROM siniestro WHERE estado IN ('APROBADO', 'RECHAZADO', 'PAGADO')").get().count;

    // Datos para gráficos / reportes solicitados por la rúbrica
    const polizasPorEstado = db.prepare(`
      SELECT estado, COUNT(*) as cantidad FROM poliza GROUP BY estado
    `).all();

    const siniestrosPorTipo = db.prepare(`
      SELECT cb.nombre AS tipo, COUNT(s.id_siniestro) AS cantidad
      FROM cobertura cb
      LEFT JOIN siniestro s ON s.id_cobertura = cb.id_cobertura
      GROUP BY cb.id_cobertura
    `).all();

    return NextResponse.json({
      metrics: {
        totalClientes,
        polizasActivas,
        siniestrosAbiertos,
        siniestrosCerrados,
      },
      charts: {
        polizasPorEstado,
        siniestrosPorTipo,
      }
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}