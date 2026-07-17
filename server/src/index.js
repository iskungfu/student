const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 初始化数据库（使用阿里云 MySQL）
require('./config/init-db');

// 路由
app.use('/api/auth', require('./routes/auth'));
app.use('/api/students', require('./routes/students'));
app.use('/api/classes', require('./routes/classes'));
app.use('/api/majors', require('./routes/majors'));
app.use('/api/dormitories', require('./routes/dormitories'));
app.use('/api/menus', require('./routes/menus'));
app.use('/api/users', require('./routes/users'));

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: '学生管理系统 API 正常运行' });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});
