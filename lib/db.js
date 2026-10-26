import Database from 'better-sqlite3';
import path from 'path';

// Asegura que siempre busque 'seguros.db' exactamente en la raíz del proyecto
const dbPath = path.join(process.cwd(), 'seguros.db');
const db = new Database(dbPath);

export default db;