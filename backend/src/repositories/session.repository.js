const { Pool } = require('pg');
const { hashSessionToken } = require('../utils/session');

class SessionRepository {
  constructor(databaseConfig) {
    this.pool = new Pool(databaseConfig);
  }

  async initialize() {
    await this.pool.query(`
      CREATE TABLE IF NOT EXISTS sessions (
        id UUID PRIMARY KEY,
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        token_hash CHAR(64) NOT NULL UNIQUE,
        expires_at TIMESTAMPTZ NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);
    await this.pool.query('CREATE INDEX IF NOT EXISTS sessions_token_hash_idx ON sessions(token_hash)');
  }

  async create(session) {
    await this.pool.query(`
      INSERT INTO sessions (id, user_id, token_hash, expires_at)
      VALUES ($1, $2, $3, $4)
    `, [session.id, session.userId, hashSessionToken(session.token), session.expiresAt]);
  }

  async findUserIdByToken(token) {
    const result = await this.pool.query(`
      SELECT user_id
      FROM sessions
      WHERE token_hash = $1 AND expires_at > NOW()
    `, [hashSessionToken(token)]);
    return result.rows[0]?.user_id;
  }

  async deleteByToken(token) {
    await this.pool.query('DELETE FROM sessions WHERE token_hash = $1', [hashSessionToken(token)]);
  }
}

module.exports = { SessionRepository };
