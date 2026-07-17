const pool = require('../config/database');

class Student {
  static async findAll(page = 1, pageSize = 10, filters = {}) {
    const offset = (page - 1) * pageSize;
    let sql = `
      SELECT s.*, c.name as class_name, m.name as major_name, d.name as dormitory_name
      FROM students s
      LEFT JOIN classes c ON s.class_id = c.id
      LEFT JOIN majors m ON s.major_id = m.id
      LEFT JOIN dormitories d ON s.dormitory_id = d.id
      WHERE 1=1
    `;
    const params = [];

    if (filters.name) {
      sql += ' AND s.name LIKE ?';
      params.push(`%${filters.name}%`);
    }
    if (filters.student_no) {
      sql += ' AND s.student_no LIKE ?';
      params.push(`%${filters.student_no}%`);
    }

    sql += ` ORDER BY s.id DESC LIMIT ${pageSize} OFFSET ${offset}`;
    const [rows] = await pool.execute(sql, params);

    // 获取总数
    let countSql = 'SELECT COUNT(*) as total FROM students WHERE 1=1';
    const countParams = [];
    if (filters.name) {
      countSql += ' AND name LIKE ?';
      countParams.push(`%${filters.name}%`);
    }
    if (filters.student_no) {
      countSql += ' AND student_no LIKE ?';
      countParams.push(`%${filters.student_no}%`);
    }
    const [count] = await pool.execute(countSql, countParams);

    return { data: rows, total: count[0].total, page, pageSize };
  }

  static async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM students WHERE id = ?', [id]);
    return rows[0];
  }

  static async create(studentData) {
    const [result] = await pool.execute(
      `INSERT INTO students (name, student_no, class_id, major_id, dormitory_id, gender, phone, id_card, birth_date, address)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        studentData.name,
        studentData.student_no,
        studentData.class_id || null,
        studentData.major_id || null,
        studentData.dormitory_id || null,
        studentData.gender || '男',
        studentData.phone || null,
        studentData.id_card || null,
        studentData.birth_date || null,
        studentData.address || null
      ]
    );
    return await this.findById(result.insertId);
  }

  static async update(id, studentData) {
    const updates = [];
    const values = [];

    if (studentData.name) {
      updates.push('name = ?');
      values.push(studentData.name);
    }
    if (studentData.student_no) {
      updates.push('student_no = ?');
      values.push(studentData.student_no);
    }
    if (studentData.class_id !== undefined) {
      updates.push('class_id = ?');
      values.push(studentData.class_id || null);
    }
    if (studentData.major_id !== undefined) {
      updates.push('major_id = ?');
      values.push(studentData.major_id || null);
    }
    if (studentData.dormitory_id !== undefined) {
      updates.push('dormitory_id = ?');
      values.push(studentData.dormitory_id || null);
    }
    if (studentData.gender) {
      updates.push('gender = ?');
      values.push(studentData.gender);
    }
    if (studentData.phone !== undefined) {
      updates.push('phone = ?');
      values.push(studentData.phone || null);
    }
    if (studentData.id_card !== undefined) {
      updates.push('id_card = ?');
      values.push(studentData.id_card || null);
    }
    if (studentData.birth_date !== undefined) {
      updates.push('birth_date = ?');
      values.push(studentData.birth_date || null);
    }
    if (studentData.address !== undefined) {
      updates.push('address = ?');
      values.push(studentData.address || null);
    }

    if (updates.length === 0) return false;

    values.push(id);
    await pool.execute(`UPDATE students SET ${updates.join(', ')} WHERE id = ?`, values);
    return await this.findById(id);
  }

  static async delete(id) {
    const [result] = await pool.execute('DELETE FROM students WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
}

module.exports = Student;
