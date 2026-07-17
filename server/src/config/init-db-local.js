// 本地 SQLite 数据库表初始化脚本
const pool = require('./database-local');

const createTables = async () => {
  try {
    // SQLite 不支持 ENUM，使用 CHECK 约束
    // 创建用户表
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        real_name TEXT,
        role_id INTEGER DEFAULT 2,
        status INTEGER DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('用户表创建成功');

    // 创建角色表
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS roles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL,
        description TEXT,
        permissions TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('角色表创建成功');

    // 创建菜单表
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS menus (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        path TEXT,
        icon TEXT,
        parent_id INTEGER DEFAULT 0,
        sort INTEGER DEFAULT 0,
        status INTEGER DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('菜单表创建成功');

    // 创建专业表
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS majors (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL,
        code TEXT UNIQUE NOT NULL,
        description TEXT,
        status INTEGER DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('专业表创建成功');

    // 创建班级表
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS classes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        major_id INTEGER,
        grade TEXT,
        head_teacher TEXT,
        status INTEGER DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('班级表创建成功');

    // 创建宿舍表
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS dormitories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        building TEXT,
        room TEXT,
        capacity INTEGER DEFAULT 4,
        used INTEGER DEFAULT 0,
        status INTEGER DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('宿舍表创建成功');

    // 创建学生表
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS students (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        student_no TEXT UNIQUE NOT NULL,
        class_id INTEGER,
        major_id INTEGER,
        dormitory_id INTEGER,
        gender TEXT DEFAULT '男' CHECK(gender IN ('男', '女')),
        phone TEXT,
        id_card TEXT,
        birth_date DATE,
        address TEXT,
        status INTEGER DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('学生表创建成功');

    // 创建索引
    await pool.execute('CREATE INDEX IF NOT EXISTS idx_class_id ON students(class_id)');
    await pool.execute('CREATE INDEX IF NOT EXISTS idx_major_id ON students(major_id)');
    await pool.execute('CREATE INDEX IF NOT EXISTS idx_dormitory_id ON students(dormitory_id)');
    console.log('索引创建成功');

    // 初始化默认数据
    await initDefaultData();

    console.log('所有数据表初始化完成！');
  } catch (error) {
    console.error('创建表失败:', error.message);
  }
};

const initDefaultData = async () => {
  // 检查是否已有管理员
  const [users] = await pool.execute('SELECT COUNT(*) as count FROM users WHERE username = ?', ['admin']);
  if (users[0].count === 0) {
    const bcrypt = require('bcryptjs');
    const password = await bcrypt.hash('admin123', 10);
    await pool.execute(
      'INSERT INTO users (username, password, real_name, role_id) VALUES (?, ?, ?, ?)',
      ['admin', password, '系统管理员', 1]
    );
    console.log('默认管理员账号创建成功: admin / admin123');
  }

  // 检查是否已有角色
  const [roles] = await pool.execute('SELECT COUNT(*) as count FROM roles');
  if (roles[0].count === 0) {
    await pool.execute('INSERT INTO roles (name, description) VALUES (?, ?)', ['超级管理员', '拥有所有权限']);
    await pool.execute('INSERT INTO roles (name, description) VALUES (?, ?)', ['普通用户', '基本操作权限']);
    console.log('默认角色创建成功');
  }

  // 检查是否已有菜单
  const [menus] = await pool.execute('SELECT COUNT(*) as count FROM menus');
  if (menus[0].count === 0) {
    const menuData = [
      ['学生管理', '/students', 'User', 0, 1],
      ['班级管理', '/classes', 'School', 0, 2],
      ['专业管理', '/majors', 'Reading', 0, 3],
      ['宿舍管理', '/dormitories', 'House', 0, 4],
      ['菜单管理', '/menus', 'Menu', 0, 5],
      ['系统管理', '/system', 'Setting', 0, 6]
    ];
    for (const menu of menuData) {
      await pool.execute(
        'INSERT INTO menus (name, path, icon, parent_id, sort) VALUES (?, ?, ?, ?, ?)',
        menu
      );
    }
    console.log('默认菜单创建成功');
  }

  // 检查是否已有专业
  const [majors] = await pool.execute('SELECT COUNT(*) as count FROM majors');
  if (majors[0].count === 0) {
    const majorData = [
      ['计算机科学与技术', 'CS001'],
      ['软件工程', 'SE001'],
      ['人工智能', 'AI001'],
      ['数据科学', 'DS001'],
      ['网络工程', 'NE001']
    ];
    for (const major of majorData) {
      await pool.execute('INSERT INTO majors (name, code) VALUES (?, ?)', major);
    }
    console.log('默认专业数据创建成功');
  }
};

// 运行初始化
createTables();
