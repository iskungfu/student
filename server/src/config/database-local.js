// 本地 SQLite 数据库配置（用于开发测试）
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// 确保数据目录存在
const dataDir = path.join(__dirname, '../../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'student.db');

console.log('使用本地 SQLite 数据库:', dbPath);

// 创建数据库连接
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('数据库连接器创建失败:', err.message);
  }
});

// 确保数据库已打开
db.serialize(() => {
  console.log('成功连接到本地 SQLite 数据库');
});

// 包装 sqlite3 以兼容 mysql2 的接口
const pool = {
  async execute(sql, params = []) {
    return new Promise((resolve, reject) => {
      db.all(sql, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          // 转换为类似 mysql2 的格式
          // 使用 lastID 作为 insertId
          const result = {
            affectedRows: rows.length > 0 ? 1 : 0,
            insertId: db.lastID || 0,
            lastID: db.lastID || 0,
            changes: rows.length
          };
          const mappedRows = rows.map(row => ({ ...row }));
          resolve([mappedRows, result]);
        }
      });
    });
  },
  async query(sql, params = []) {
    return this.execute(sql, params);
  },
  async run(sql, params = []) {
    return new Promise((resolve, reject) => {
      db.run(sql, params, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({
            affectedRows: this.changes || 0,
            insertId: this.lastID || 0,
            lastID: this.lastID || 0,
            changes: this.changes || 0
          });
        }
      });
    });
  },
  getConnection() {
    return Promise.resolve({
      execute: this.execute.bind(this),
      query: this.query.bind(this),
      run: this.run.bind(this),
      release() {}
    });
  }
};

module.exports = pool;
