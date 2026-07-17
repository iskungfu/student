const Class = require('../models/Class');

class ClassController {
  static async getAll(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.pageSize) || 10;
      const result = await Class.findAll(page, pageSize);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getList(req, res) {
    try {
      const classes = await Class.getAll();
      res.json({ data: classes });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getById(req, res) {
    try {
      const cls = await Class.findById(req.params.id);
      if (!cls) {
        return res.status(404).json({ error: '班级不存在' });
      }
      res.json({ class: cls });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async create(req, res) {
    try {
      const cls = await Class.create(req.body);
      res.status(201).json({ message: '班级创建成功', class: cls });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async update(req, res) {
    try {
      const cls = await Class.update(req.params.id, req.body);
      if (!cls) {
        return res.status(404).json({ error: '班级不存在' });
      }
      res.json({ message: '班级更新成功', class: cls });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async delete(req, res) {
    try {
      const success = await Class.delete(req.params.id);
      if (!success) {
        return res.status(404).json({ error: '班级不存在' });
      }
      res.json({ message: '班级删除成功' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = ClassController;
