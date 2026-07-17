const User = require('../models/User');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

class AuthController {
  static async login(req, res) {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ error: '用户名和密码不能为空' });
      }

      const user = await User.findByUsername(username);
      if (!user) {
        return res.status(401).json({ error: '用户名或密码错误' });
      }

      if (user.status !== 1) {
        return res.status(401).json({ error: '用户已被禁用' });
      }

      const isValid = await User.verifyPassword(password, user.password);
      if (!isValid) {
        return res.status(401).json({ error: '用户名或密码错误' });
      }

      const token = jwt.sign(
        { id: user.id, username: user.username, realName: user.real_name, roleId: user.role_id },
        config.jwtSecret,
        { expiresIn: config.jwtExpiresIn }
      );

      res.json({
        message: '登录成功',
        token,
        user: {
          id: user.id,
          username: user.username,
          realName: user.real_name,
          roleId: user.role_id
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async register(req, res) {
    try {
      const { username, password, realName } = req.body;

      if (!username || !password) {
        return res.status(400).json({ error: '用户名和密码不能为空' });
      }

      const existingUser = await User.findByUsername(username);
      if (existingUser) {
        return res.status(400).json({ error: '用户名已存在' });
      }

      const user = await User.create({ username, password, real_name: realName, role_id: 2 });

      res.status(201).json({
        message: '注册成功',
        user: {
          id: user.id,
          username: user.username,
          realName: user.real_name
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getProfile(req, res) {
    try {
      const user = await User.findById(req.user.id);
      res.json({ user });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = AuthController;
