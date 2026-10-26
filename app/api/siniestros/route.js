import db from '@/lib/db';
import { NextResponse } from 'next/server';

// GET: Listar siniestros con datos de la póliza
export async function GET() {
  try {
    const siniestros = db.prepare(`
      SELECT s.*, p.numero_poliza 
      FROM siniestro s
      JOIN poliza p ON p.id_poliza = s.id_poliza
      ORDER BY s.fecha_siniestro DESC
    `).all();
    return NextResponse.json(siniestros);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Registrar un nuevo siniestro
export async function POST(request) {
  try {
    const data = await request.json();
    const { id_poliza, id_cobertura, fecha_siniestro, descripcion, monto_reclamado } = data;

    const stmt = db.prepare(`
      INSERT INTO siniestro (id_poliza, id_cobertura, fecha_siniestro, descripcion, monto_reclamado, estado)
      VALUES (?, ?, ?, ?, ?, 'REPORTADO')
    `);

    const info = stmt.run(id_poliza, id_cobertura, fecha_siniestro, descripcion, monto_reclamado);
    return NextResponse.json({ id_siniestro: info.lastInsertRowid, ...data }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT: Modificar el estado de un siniestro (Ej: de ABIERTO/REPORTADO a CERRADO/APROBADO)
export async function PUT(request) {
  try {
    const data = await request.json();
    const { id_siniestro, estado } = data;

    const stmt = db.prepare(`
      UPDATE siniestro SET estado = ? WHERE id_siniestro = ?
    `);
    stmt.run(estado, id_siniestro);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}