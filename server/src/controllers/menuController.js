const Menu = require('../models/Menu');

class MenuController {
  static async getAll(req, res) {
    try {
      const menus = await Menu.findAll();
      res.json({ data: menus });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getById(req, res) {
    try {
      const menu = await Menu.findById(req.params.id);
      if (!menu) {
        return res.status(404).json({ error: '菜单不存在' });
      }
      res.json({ menu });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async create(req, res) {
    try {
      const menu = await Menu.create(req.body);
      res.status(201).json({ message: '菜单创建成功', menu });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async update(req, res) {
    try {
      const menu = await Menu.update(req.params.id, req.body);
      if (!menu) {
        return res.status(404).json({ error: '菜单不存在' });
      }
      res.json({ message: '菜单更新成功', menu });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async delete(req, res) {
    try {
      const success = await Menu.delete(req.params.id);
      if (!success) {
        return res.status(404).json({ error: '菜单不存在' });
      }
      res.json({ message: '菜单删除成功' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = MenuController;
