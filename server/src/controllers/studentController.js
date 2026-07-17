const Student = require('../models/Student');

class StudentController {
  static async getAll(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.pageSize) || 10;
      const filters = {
        name: req.query.name,
        student_no: req.query.student_no
      };
      const result = await Student.findAll(page, pageSize, filters);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getById(req, res) {
    try {
      const student = await Student.findById(req.params.id);
      if (!student) {
        return res.status(404).json({ error: '学生不存在' });
      }
      res.json({ student });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async create(req, res) {
    try {
      const student = await Student.create(req.body);
      res.status(201).json({ message: '学生创建成功', student });
    } catch (error) {
      if (error.message && error.message.includes('UNIQUE')) {
        return res.status(400).json({ error: '学号已存在' });
      }
      res.status(500).json({ error: error.message });
    }
  }

  static async update(req, res) {
    try {
      const student = await Student.update(req.params.id, req.body);
      if (!student) {
        return res.status(404).json({ error: '学生不存在' });
      }
      res.json({ message: '学生更新成功', student });
    } catch (error) {
      if (error.message && error.message.includes('UNIQUE')) {
        return res.status(400).json({ error: '学号已存在' });
      }
      res.status(500).json({ error: error.message });
    }
  }

  static async delete(req, res) {
    try {
      const success = await Student.delete(req.params.id);
      if (!success) {
        return res.status(404).json({ error: '学生不存在' });
      }
      res.json({ message: '学生删除成功' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = StudentController;
