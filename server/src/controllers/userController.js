const User = require('../models/User');

class UserController {
  static async getAll(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.pageSize) || 10;
      const result = await User.findAll(page, pageSize);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getById(req, res) {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ error: '用户不存在' });
      }
      res.json({ user });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async create(req, res) {
    try {
      const user = await User.create(req.body);
      res.status(201).json({ message: '用户创建成功', user });
    } catch (error) {
      if (error.message && error.message.includes('UNIQUE')) {
        return res.status(400).json({ error: '用户名已存在' });
      }
      res.status(500).json({ error: error.message });
    }
  }

  static async update(req, res) {
    try {
      const user = await User.update(req.params.id, req.body);
      if (!user) {
        return res.status(404).json({ error: '用户不存在' });
      }
      res.json({ message: '用户更新成功', user });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async delete(req, res) {
    try {
      const success = await User.delete(req.params.id);
      if (!success) {
        return res.status(404).json({ error: '用户不存在' });
      }
      res.json({ message: '用户删除成功' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = UserController;
