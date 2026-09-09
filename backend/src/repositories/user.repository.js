const { Pool } = require('pg');

class UserRepository {
  constructor(databaseConfig) {
    this.pool = new Pool(databaseConfig);
  }

  async initialize() {
    await this.pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY,
        name VARCHAR(120) NOT NULL,
        email VARCHAR(320) NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        avatar_key TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);
  }

  async findById(id) {
    const result = await this.pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return this.mapRow(result.rows[0]);
  }

  async findByEmail(email) {
    const result = await this.pool.query('SELECT * FROM users WHERE email = $1', [email.toLowerCase()]);
    return this.mapRow(result.rows[0]);
  }

  async create(user) {
    const result = await this.pool.query(`
      INSERT INTO users (id, name, email, password_hash, avatar_key, created_at)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [user.id, user.name, user.email, user.passwordHash, user.avatarKey, user.createdAt]);
    return this.mapRow(result.rows[0]);
  }

  async update(id, changes) {
    const result = await this.pool.query(
      'UPDATE users SET avatar_key = COALESCE($2, avatar_key) WHERE id = $1 RETURNING *',
      [id, changes.avatarKey],
    );
    return this.mapRow(result.rows[0]);
  }

  mapRow(row) {
    if (!row) {
      return undefined;
    }

    return {
      id: row.id,
      name: row.name,
      email: row.email,
      passwordHash: row.password_hash,
      avatarKey: row.avatar_key,
      createdAt: row.created_at,
    };
  }
}

module.exports = { UserRepository };
