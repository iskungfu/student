const pool = require('../config/database');

class Class {
  static async findAll(page = 1, pageSize = 10) {
    const offset = (page - 1) * pageSize;
    const [rows] = await pool.execute(
      `SELECT c.*, m.name as major_name FROM classes c LEFT JOIN majors m ON c.major_id = m.id ORDER BY c.id DESC LIMIT ${pageSize} OFFSET ${offset}`
    );
    const [count] = await pool.execute('SELECT COUNT(*) as total FROM classes');
    return { data: rows, total: count[0].total, page, pageSize };
  }

  static async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM classes WHERE id = ?', [id]);
    return rows[0];
  }

  static async getAll() {
    const [rows] = await pool.execute('SELECT * FROM classes WHERE status = 1 ORDER BY id');
    return rows;
  }

  static async create(classData) {
    const [result] = await pool.execute(
      'INSERT INTO classes (name, major_id, grade, head_teacher) VALUES (?, ?, ?, ?)',
      [classData.name, classData.major_id || null, classData.grade || null, classData.head_teacher || null]
    );
    return await this.findById(result.insertId);
  }

  static async update(id, classData) {
    const updates = [];
    const values = [];

    if (classData.name) {
      updates.push('name = ?');
      values.push(classData.name);
    }
    if (classData.major_id !== undefined) {
      updates.push('major_id = ?');
      values.push(classData.major_id || null);
    }
    if (classData.grade !== undefined) {
      updates.push('grade = ?');
      values.push(classData.grade || null);
    }
    if (classData.head_teacher !== undefined) {
      updates.push('head_teacher = ?');
      values.push(classData.head_teacher || null);
    }

    if (updates.length === 0) return false;

    values.push(id);
    await pool.execute(`UPDATE classes SET ${updates.join(', ')} WHERE id = ?`, values);
    return await this.findById(id);
  }

  static async delete(id) {
    const [result] = await pool.execute('DELETE FROM classes WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
}

module.exports = Class;
