const pool = require("../config/db");

const User = {
  // ========================================
  // CREATE USER
  // ========================================
  async create(name, email, password, account_type = "Finance Admin") {
    const result = await pool.query(
      `INSERT INTO users
       (name, email, password, account_type)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, account_type, created_at`,
      [
        name,
        email,
        password,
        account_type,
      ]
    );

    return result.rows[0];
  },

  // ========================================
  // FIND USER BY EMAIL
  // ========================================
  async findByEmail(email) {
    const result = await pool.query(
      `SELECT *
       FROM users
       WHERE email = $1`,
      [email]
    );

    return result.rows[0];
  },

  // ========================================
  // FIND USER BY ID
  // ========================================
  async findById(id) {
    const result = await pool.query(
      `SELECT
        id,
        name,
        email,
        account_type,
        created_at
       FROM users
       WHERE id = $1`,
      [id]
    );

    return result.rows[0];
  },
};

module.exports = User;