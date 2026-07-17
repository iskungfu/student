// 数据库表初始化脚本
const pool = require('./database');

const createTables = async () => {
  try {
    // 创建用户表
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        real_name VARCHAR(50),
        role_id INT DEFAULT 2,
        status TINYINT DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
    console.log('用户表创建成功');

    // 创建角色表
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS roles (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(50) UNIQUE NOT NULL,
        description VARCHAR(200),
        permissions TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
    console.log('角色表创建成功');

    // 创建菜单表
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS menus (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(50) NOT NULL,
        path VARCHAR(100),
        icon VARCHAR(50),
        parent_id INT DEFAULT 0,
        sort INT DEFAULT 0,
        status TINYINT DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
    console.log('菜单表创建成功');

    // 创建专业表
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS majors (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(50) UNIQUE NOT NULL,
        code VARCHAR(20) UNIQUE NOT NULL,
        description VARCHAR(200),
        status TINYINT DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
    console.log('专业表创建成功');

    // 创建班级表
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS classes (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(50) NOT NULL,
        major_id INT,
        grade VARCHAR(10),
        head_teacher VARCHAR(50),
        status TINYINT DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
    console.log('班级表创建成功');

    // 创建宿舍表
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS dormitories (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(50) NOT NULL,
        building VARCHAR(20),
        room VARCHAR(20),
        capacity INT DEFAULT 4,
        used INT DEFAULT 0,
        status TINYINT DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
    console.log('宿舍表创建成功');

    // 创建学生表
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS students (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(50) NOT NULL,
        student_no VARCHAR(20) UNIQUE NOT NULL,
        class_id INT,
        major_id INT,
        dormitory_id INT,
        gender ENUM('男','女') DEFAULT '男',
        phone VARCHAR(20),
        id_card VARCHAR(18),
        birth_date DATE,
        address VARCHAR(200),
        status TINYINT DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        KEY idx_class_id (class_id),
        KEY idx_major_id (major_id),
        KEY idx_dormitory_id (dormitory_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
    console.log('学生表创建成功');

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
