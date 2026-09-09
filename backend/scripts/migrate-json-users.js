const fs = require('node:fs/promises');
const path = require('node:path');
const { Pool } = require('pg');
const { env } = require('../src/config/env');

async function migrateUsers() {
  const sourceFile = path.join(__dirname, '..', 'data', 'users.json');
  const users = JSON.parse(await fs.readFile(sourceFile, 'utf8'));
  const pool = new Pool(env.database);

  try {
    for (const user of users) {
      await pool.query(`
        INSERT INTO users (id, name, email, password_hash, avatar_key, created_at)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (email) DO NOTHING
      `, [user.id, user.name, user.email, user.passwordHash, user.avatarKey, user.createdAt]);
    }

    console.log(`Migrated ${users.length} users.`);
  } finally {
    await pool.end();
  }
}

migrateUsers().catch((error) => {
  console.error('Unable to migrate users:', error);
  process.exitCode = 1;
});
