const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || '47.86.55.121',
  port: process.env.DB_PORT || 13306,
  user: process.env.DB_USER || 'ai',
  password: process.env.DB_PASSWORD || 'JSnbhcrZPEfBBir8',
  database: process.env.DB_NAME || 'ai',
  waitForConnections: true,
  connectionLimit: 2,
  queueLimit: 0
});

pool.getConnection()
  .then(connection => {
    console.log('成功连接到 MySQL 数据库');
    connection.release();
  })
  .catch(err => {
    console.error('数据库连接失败:', err.message);
  });

module.exports = pool;
