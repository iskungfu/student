const pool = require('../config/database');

class Dormitory {
  static async findAll(page = 1, pageSize = 10) {
    const offset = (page - 1) * pageSize;
    const [rows] = await pool.execute(`SELECT * FROM dormitories ORDER BY id DESC LIMIT ${pageSize} OFFSET ${offset}`);
    const [count] = await pool.execute('SELECT COUNT(*) as total FROM dormitories');
    return { data: rows, total: count[0].total, page, pageSize };
  }

  static async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM dormitories WHERE id = ?', [id]);
    return rows[0];
  }

  static async getAll() {
    const [rows] = await pool.execute('SELECT * FROM dormitories WHERE status = 1 ORDER BY id');
    return rows;
  }

  static async create(dormitoryData) {
    const [result] = await pool.execute(
      'INSERT INTO dormitories (name, building, room, capacity) VALUES (?, ?, ?, ?)',
      [dormitoryData.name, dormitoryData.building || null, dormitoryData.room || null, dormitoryData.capacity || 4]
    );
    return await this.findById(result.insertId);
  }

  static async update(id, dormitoryData) {
    const updates = [];
    const values = [];

    if (dormitoryData.name) {
      updates.push('name = ?');
      values.push(dormitoryData.name);
    }
    if (dormitoryData.building !== undefined) {
      updates.push('building = ?');
      values.push(dormitoryData.building || null);
    }
    if (dormitoryData.room !== undefined) {
      updates.push('room = ?');
      values.push(dormitoryData.room || null);
    }
    if (dormitoryData.capacity !== undefined) {
      updates.push('capacity = ?');
      values.push(dormitoryData.capacity || 4);
    }

    if (updates.length === 0) return false;

    values.push(id);
    await pool.execute(`UPDATE dormitories SET ${updates.join(', ')} WHERE id = ?`, values);
    return await this.findById(id);
  }

  static async delete(id) {
    const [result] = await pool.execute('DELETE FROM dormitories WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
}

module.exports = Dormitory;
