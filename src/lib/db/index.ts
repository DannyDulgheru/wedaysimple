import Database from 'better-sqlite3';
import path from 'path';
import { initializeDatabase } from './schema';

const dbPath = path.join(process.cwd(), 'database', 'wedding.db');
let db: Database.Database | null = null;

export function getDatabase(): Database.Database {
  if (!db) {
    db = new Database(dbPath);
    db.pragma('journal_mode = WAL');
    initializeDatabase(db);
  }
  return db;
}

export function closeDatabase() {
  if (db) {
    db.close();
    db = null;
  }
}
