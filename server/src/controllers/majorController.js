const Major = require('../models/Major');

class MajorController {
  static async getAll(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.pageSize) || 10;
      const result = await Major.findAll(page, pageSize);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getList(req, res) {
    try {
      const majors = await Major.getAll();
      res.json({ data: majors });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getById(req, res) {
    try {
      const major = await Major.findById(req.params.id);
      if (!major) {
        return res.status(404).json({ error: '专业不存在' });
      }
      res.json({ major });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async create(req, res) {
    try {
      const major = await Major.create(req.body);
      res.status(201).json({ message: '专业创建成功', major });
    } catch (error) {
      if (error.message && error.message.includes('UNIQUE')) {
        return res.status(400).json({ error: '专业代码或名称已存在' });
      }
      res.status(500).json({ error: error.message });
    }
  }

  static async update(req, res) {
    try {
      const major = await Major.update(req.params.id, req.body);
      if (!major) {
        return res.status(404).json({ error: '专业不存在' });
      }
      res.json({ message: '专业更新成功', major });
    } catch (error) {
      if (error.message && error.message.includes('UNIQUE')) {
        return res.status(400).json({ error: '专业代码或名称已存在' });
      }
      res.status(500).json({ error: error.message });
    }
  }

  static async delete(req, res) {
    try {
      const success = await Major.delete(req.params.id);
      if (!success) {
        return res.status(404).json({ error: '专业不存在' });
      }
      res.json({ message: '专业删除成功' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = MajorController;
