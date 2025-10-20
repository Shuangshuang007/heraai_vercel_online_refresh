const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// 确保 db 目录存在
const dbDir = path.join(__dirname, '../db');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'hera.db');
const db = new sqlite3.Database(dbPath);

// 初始化数据库表
function initDb() {
  db.serialize(() => {
    // Users 表
    db.run(`
      CREATE TABLE IF NOT EXISTS Users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        name TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Jobs 表
    db.run(`
      CREATE TABLE IF NOT EXISTS Jobs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        platform TEXT NOT NULL,
        job_title TEXT NOT NULL,
        company TEXT,
        location TEXT,
        summary TEXT,
        match_score INTEGER,
        url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // UserJobs 表
    db.run(`
      CREATE TABLE IF NOT EXISTS UserJobs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        job_id INTEGER NOT NULL,
        status TEXT CHECK(status IN ('saved', 'applied', 'ignored')) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES Users(id),
        FOREIGN KEY (job_id) REFERENCES Jobs(id)
      )
    `);

    // SearchHistory 表
    db.run(`
      CREATE TABLE IF NOT EXISTS SearchHistory (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        query TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES Users(id)
      )
    `);

    // Resumes 表
    db.run(`
      CREATE TABLE IF NOT EXISTS Resumes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        file_path TEXT NOT NULL,
        parsed_content TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES Users(id)
      )
    `);
  });
}

// 用户相关操作
const userDb = {
  /**
   * @param {string} email
   * @param {string} password
   * @param {string} name
   * @returns {Promise<number>} 新用户ID
   */
  createUser: (email, password, name) => {
    return new Promise((resolve, reject) => {
      db.run('INSERT INTO Users (email, password, name) VALUES (?, ?, ?)', [email, password, name], function(err) {
        if (err) reject(err);
        else resolve(this.lastID);
      });
    });
  },
  /**
   * @param {string} email
   * @returns {Promise<any>}
   */
  getUserByEmail: (email) => {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM Users WHERE email = ?', [email], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }
};

// 职位相关操作
const jobDb = {
  /**
   * @param {string} platform
   * @param {string} jobTitle
   * @param {string} company
   * @param {string} location
   * @param {string} summary
   * @param {number} matchScore
   * @param {string} url
   * @returns {Promise<number>}
   */
  createJob: (platform, jobTitle, company, location, summary, matchScore, url) => {
    return new Promise((resolve, reject) => {
      db.run('INSERT INTO Jobs (platform, job_title, company, location, summary, match_score, url) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [platform, jobTitle, company, location, summary, matchScore, url], function(err) {
        if (err) reject(err);
        else resolve(this.lastID);
      });
    });
  },
  /**
   * @returns {Promise<any[]>}
   */
  getJobs: () => {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM Jobs', [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }
};

// 用户-职位关系操作
const userJobDb = {
  /**
   * @param {number} userId
   * @param {number} jobId
   * @param {string} status
   * @returns {Promise<number>}
   */
  createUserJob: (userId, jobId, status) => {
    return new Promise((resolve, reject) => {
      db.run('INSERT INTO UserJobs (user_id, job_id, status) VALUES (?, ?, ?)', [userId, jobId, status], function(err) {
        if (err) reject(err);
        else resolve(this.lastID);
      });
    });
  },
  /**
   * @param {number} userId
   * @returns {Promise<any[]>}
   */
  getUserJobs: (userId) => {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM UserJobs WHERE user_id = ?', [userId], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }
};

// 搜索历史操作
const searchHistoryDb = {
  /**
   * @param {number} userId
   * @param {string} query
   * @returns {Promise<number>}
   */
  createSearchHistory: (userId, query) => {
    return new Promise((resolve, reject) => {
      db.run('INSERT INTO SearchHistory (user_id, query) VALUES (?, ?)', [userId, query], function(err) {
        if (err) reject(err);
        else resolve(this.lastID);
      });
    });
  },
  /**
   * @param {number} userId
   * @returns {Promise<any[]>}
   */
  getSearchHistory: (userId) => {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM SearchHistory WHERE user_id = ?', [userId], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }
};

// 简历操作
const resumeDb = {
  /**
   * @param {number} userId
   * @param {string} filePath
   * @param {string} parsedContent
   * @returns {Promise<number>}
   */
  createResume: (userId, filePath, parsedContent) => {
    return new Promise((resolve, reject) => {
      db.run('INSERT INTO Resumes (user_id, file_path, parsed_content) VALUES (?, ?, ?)', [userId, filePath, parsedContent], function(err) {
        if (err) reject(err);
        else resolve(this.lastID);
      });
    });
  },
  /**
   * @param {number} userId
   * @returns {Promise<any[]>}
   */
  getResumes: (userId) => {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM Resumes WHERE user_id = ?', [userId], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }
};

// 初始化数据库
initDb();

// 导出所有函数
module.exports = {
  userDb,
  jobDb,
  userJobDb,
  searchHistoryDb,
  resumeDb,
  // 直接导出常用函数
  saveUserJob: userJobDb.createUserJob,
  createJob: jobDb.createJob,
  getUserJobs: userJobDb.getUserJobs
}; 