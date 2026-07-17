const pool = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  static async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM users WHERE id = ?', [id]);
    return rows[0];
  }

  static async findByUsername(username) {
    const [rows] = await pool.execute('SELECT * FROM users WHERE username = ?', [username]);
    return rows[0];
  }

  static async findAll(page = 1, pageSize = 10) {
    const offset = (page - 1) * pageSize;
    const [rows] = await pool.execute(
      `SELECT u.*, r.name as role_name FROM users u LEFT JOIN roles r ON u.role_id = r.id ORDER BY u.id DESC LIMIT ${pageSize} OFFSET ${offset}`
    );
    const [count] = await pool.execute('SELECT COUNT(*) as total FROM users');
    return { data: rows, total: count[0].total, page, pageSize };
  }

  static async create(userData) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const [result] = await pool.execute(
      'INSERT INTO users (username, password, real_name, role_id) VALUES (?, ?, ?, ?)',
      [userData.username, hashedPassword, userData.real_name, userData.role_id]
    );
    return await this.findById(result.insertId);
  }

  static async update(id, userData) {
    const updates = [];
    const values = [];

    if (userData.real_name) {
      updates.push('real_name = ?');
      values.push(userData.real_name);
    }
    if (userData.role_id) {
      updates.push('role_id = ?');
      values.push(userData.role_id);
    }
    if (userData.status !== undefined) {
      updates.push('status = ?');
      values.push(userData.status);
    }
    if (userData.password) {
      updates.push('password = ?');
      values.push(await bcrypt.hash(userData.password, 10));
    }

    if (updates.length === 0) return false;

    values.push(id);
    await pool.execute(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`, values);
    return await this.findById(id);
  }

  static async delete(id) {
    const [result] = await pool.execute('DELETE FROM users WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  static async verifyPassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }
}

module.exports = User;
