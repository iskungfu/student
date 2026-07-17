const pool = require('../config/database');

class Menu {
  static async findAll() {
    const [rows] = await pool.execute('SELECT * FROM menus WHERE status = 1 ORDER BY sort ASC, id ASC');
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.execute('SELECT * FROM menus WHERE id = ?', [id]);
    return rows[0];
  }

  static async create(menuData) {
    const [result] = await pool.execute(
      'INSERT INTO menus (name, path, icon, parent_id, sort) VALUES (?, ?, ?, ?, ?)',
      [menuData.name, menuData.path || null, menuData.icon || null, menuData.parent_id || 0, menuData.sort || 0]
    );
    return await this.findById(result.insertId);
  }

  static async update(id, menuData) {
    const updates = [];
    const values = [];

    if (menuData.name) {
      updates.push('name = ?');
      values.push(menuData.name);
    }
    if (menuData.path !== undefined) {
      updates.push('path = ?');
      values.push(menuData.path || null);
    }
    if (menuData.icon !== undefined) {
      updates.push('icon = ?');
      values.push(menuData.icon || null);
    }
    if (menuData.parent_id !== undefined) {
      updates.push('parent_id = ?');
      values.push(menuData.parent_id || 0);
    }
    if (menuData.sort !== undefined) {
      updates.push('sort = ?');
      values.push(menuData.sort || 0);
    }

    if (updates.length === 0) return false;

    values.push(id);
    await pool.execute(`UPDATE menus SET ${updates.join(', ')} WHERE id = ?`, values);
    return await this.findById(id);
  }

  static async delete(id) {
    const [result] = await pool.execute('DELETE FROM menus WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
}

module.exports = Menu;
