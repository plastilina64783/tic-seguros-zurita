import db from '@/lib/db';
import { NextResponse } from 'next/server';

// 1. GET: Obtener todos los clientes ordenados por apellido
export async function GET() {
  try {
    const clientes = db.prepare('SELECT * FROM cliente ORDER BY apellido, nombre').all();
    return NextResponse.json(clientes);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 2. POST: Crear un nuevo cliente en la base de datos
export async function POST(request) {
  try {
    const data = await request.json();
    const { nombre, apellido, documento, email, telefono, fecha_nacimiento, direccion } = data;

    const stmt = db.prepare(`
      INSERT INTO cliente (nombre, apellido, documento, email, telefono, fecha_nacimiento, direccion)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const info = stmt.run(nombre, apellido, documento, email, telefono, fecha_nacimiento, direccion);
    
    return NextResponse.json({ 
      id_cliente: info.lastInsertRowid, 
      ...data 
    }, { status: 201 });
    
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}