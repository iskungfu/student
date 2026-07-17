const pool = require('../config/database');

class Major {
  static async findAll(page = 1, pageSize = 10) {
    const offset = (page - 1) * pageSize;
    const [rows] = await pool.execute(`SELECT * FROM majors ORDER BY id DESC LIMIT ${pageSize} OFFSET ${offset}`);
    const [count] = await pool.execute('SELECT COUNT(*) as total FROM majors');
    return { data: rows, total: count[0].total, page, pageSize };
  }

  static async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM majors WHERE id = ?', [id]);
    return rows[0];
  }

  static async getAll() {
    const [rows] = await pool.execute('SELECT * FROM majors WHERE status = 1 ORDER BY id');
    return rows;
  }

  static async create(majorData) {
    const [result] = await pool.execute(
      'INSERT INTO majors (name, code, description) VALUES (?, ?, ?)',
      [majorData.name, majorData.code, majorData.description || null]
    );
    return await this.findById(result.insertId);
  }

  static async update(id, majorData) {
    const updates = [];
    const values = [];

    if (majorData.name) {
      updates.push('name = ?');
      values.push(majorData.name);
    }
    if (majorData.code) {
      updates.push('code = ?');
      values.push(majorData.code);
    }
    if (majorData.description !== undefined) {
      updates.push('description = ?');
      values.push(majorData.description || null);
    }

    if (updates.length === 0) return false;

    values.push(id);
    await pool.execute(`UPDATE majors SET ${updates.join(', ')} WHERE id = ?`, values);
    return await this.findById(id);
  }

  static async delete(id) {
    const [result] = await pool.execute('DELETE FROM majors WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
}

module.exports = Major;
