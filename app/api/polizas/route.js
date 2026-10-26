import db from '@/lib/db';
import { NextResponse } from 'next/server';

// GET: Listar pólizas con el nombre del cliente asociado
export async function GET() {
  try {
    const polizas = db.prepare(`
      SELECT p.*, c.nombre, c.apellido 
      FROM poliza p
      JOIN cliente c ON c.id_cliente = p.id_cliente
      ORDER BY p.fecha_inicio DESC
    `).all();
    return NextResponse.json(polizas);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Crear nueva póliza
export async function POST(request) {
  try {
    const data = await request.json();
    const { numero_poliza, id_cliente, fecha_inicio, fecha_fin, prima, estado } = data;

    const stmt = db.prepare(`
      INSERT INTO poliza (numero_poliza, id_cliente, fecha_inicio, fecha_fin, prima, estado)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const info = stmt.run(numero_poliza, id_cliente, fecha_inicio, fecha_fin, prima, estado);
    return NextResponse.json({ id_poliza: info.lastInsertRowid, ...data }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}