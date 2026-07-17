// 阿里云 MySQL 数据库配置
const mysql = require('mysql2/promise');

// 数据库连接池配置
const pool = mysql.createPool({
  host: '47.86.55.121',
  port: 13306,
  user: 'ai',
  password: 'JSnbhcrZPEfBBir8',
  database: 'ai',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

// 测试数据库连接
pool.getConnection()
  .then(connection => {
    console.log('成功连接到阿里云 MySQL 数据库');
    connection.release();
  })
  .catch(err => {
    console.error('数据库连接失败:', err.message);
  });

module.exports = pool;
