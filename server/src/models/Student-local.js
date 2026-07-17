const pool = require('../config/database-local');

class Student {
  static async findAll(page = 1, pageSize = 10, filters = {}) {
    const offset = (page - 1) * pageSize;
    const sql = 'SELECT s.*, c.name as class_name, m.name as major_name, d.name as dormitory_name FROM students s LEFT JOIN classes c ON s.class_id = c.id LEFT JOIN majors m ON s.major_id = m.id LEFT JOIN dormitories d ON s.dormitory_id = d.id WHERE 1 = 1 ORDER BY s.id DESC LIMIT ? OFFSET ?';
    const params = [pageSize, offset];
    const [rows] = await pool.execute(sql, params);
    const countSql = 'SELECT COUNT(*) as total FROM students WHERE 1 = 1';
    const [count] = await pool.execute(countSql, []);
    return { data: rows, total: count[0].total, page, pageSize };
  }

  static async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM students WHERE id = ?', [id]);
    return rows[0];
  }

  static async create(studentData) {
    const sql = 'INSERT INTO students (name, student_no, class_id, major_id, dormitory_id, gender, phone, id_card, birth_date, address) VALUES (?,?,?,?,?,?,?,?,?)';
    const vals = [];
    vals.push(studentData.name);
    vals.push(studentData.student_no);
    vals.push(studentData.class_id && studentData.class_id > 0 ? studentData.class_id : null);
    vals.push(studentData.major_id && studentData.major_id > 0 ? studentData.major_id : null);
    vals.push(studentData.dormitory_id && studentData.dormitory_id > 0 ? studentData.dormitory_id : null);
    vals.push(studentData.gender || '男');
    vals.push(studentData.phone || null);
    vals.push(studentData.id_card || null);
    vals.push(studentData.birth_date || null);
    vals.push(studentData.address || null);
    const result = await pool.run(sql, vals);
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
      values.push((studentData.class_id && studentData.class_id > 0) ? studentData.class_id : null);
    }
    if (studentData.major_id !== undefined) {
      updates.push('major_id = ?');
      values.push((studentData.major_id && studentData.major_id > 0) ? studentData.major_id : null);
    }
    if (studentData.dormitory_id !== undefined) {
      updates.push('dormitory_id = ?');
      values.push((studentData.dormitory_id && studentData.dormitory_id > 0) ? studentData.dormitory_id : null);
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
    await pool.run('UPDATE students SET ' + updates.join(', ') + ' WHERE id = ?', values);
    return await this.findById(id);
  }

  static async delete(id) {
    const result = await pool.run('DELETE FROM students WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
}

module.exports = Student;
