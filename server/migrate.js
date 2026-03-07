import fs from 'fs';
import path from 'path';
import sqlite3 from 'sqlite3';

const DB_DIR = path.resolve('./db');
const DB_PATH = path.join(DB_DIR, 'pos.db');
sqlite3.verbose();
const db = new sqlite3.Database(DB_PATH);

const migrationsDir = path.resolve('./migrations');
if (!fs.existsSync(migrationsDir)) {
  console.log('No migrations directory found.');
  process.exit(0);
}

function run(sql) {
  return new Promise((resolve, reject) => {
    db.exec(sql, (err) => (err ? reject(err) : resolve()));
  });
}

async function main() {
  db.serialize();
  const files = fs
    .readdirSync(migrationsDir)
    .filter((f) => f.endsWith('.sql'))
    .sort();
  for (const file of files) {
    const content = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
    console.log(`Applying migration: ${file}`);
    await run(content);
  }
  console.log('Migrations applied.');
  process.exit(0);
}

main().catch((e) => {
  console.error('Migration failed', e);
  process.exit(1);
});
