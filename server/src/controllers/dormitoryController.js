const Dormitory = require('../models/Dormitory');

class DormitoryController {
  static async getAll(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.pageSize) || 10;
      const result = await Dormitory.findAll(page, pageSize);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getList(req, res) {
    try {
      const dormitories = await Dormitory.getAll();
      res.json({ data: dormitories });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getById(req, res) {
    try {
      const dormitory = await Dormitory.findById(req.params.id);
      if (!dormitory) {
        return res.status(404).json({ error: '宿舍不存在' });
      }
      res.json({ dormitory });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async create(req, res) {
    try {
      const dormitory = await Dormitory.create(req.body);
      res.status(201).json({ message: '宿舍创建成功', dormitory });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async update(req, res) {
    try {
      const dormitory = await Dormitory.update(req.params.id, req.body);
      if (!dormitory) {
        return res.status(404).json({ error: '宿舍不存在' });
      }
      res.json({ message: '宿舍更新成功', dormitory });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async delete(req, res) {
    try {
      const success = await Dormitory.delete(req.params.id);
      if (!success) {
        return res.status(404).json({ error: '宿舍不存在' });
      }
      res.json({ message: '宿舍删除成功' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = DormitoryController;
