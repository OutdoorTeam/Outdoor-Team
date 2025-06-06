import { Kysely, SqliteDialect } from 'kysely';
import Database from 'better-sqlite3';
import path from 'path';
import type { DatabaseSchema } from './schema.js';

const dataDirectory = process.env.DATA_DIRECTORY || './data';
const databasePath = path.join(dataDirectory, 'database.sqlite');

console.log('Database path:', databasePath);

const sqliteDb = new Database(databasePath);

export const db = new Kysely<DatabaseSchema>({
  dialect: new SqliteDialect({
    database: sqliteDb,
  }),
  log: ['query', 'error']
});
