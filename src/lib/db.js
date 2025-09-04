const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');

// 始终写入项目根目录下的 db 目录
const dbDir = path.join(process.cwd(), 'db');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'hera.db');
console.log('[DB] dbPath:', dbPath); // 打印实际写入路径
const db = new sqlite3.Database(dbPath);

// 初始化 UserJobs 表（如未存在）
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS UserJobs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      job_id TEXT NOT NULL,
      status TEXT CHECK(status IN ('saved', 'applied', 'ignored')) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

function saveUserJob(userId, jobId, status = 'saved') {
  console.log('[DB] saveUserJob called', userId, jobId, status);
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO UserJobs (user_id, job_id, status) VALUES (?, ?, ?)',
      [userId, jobId, status],
      function (err) {
        if (err) {
          console.error('[DB] Error:', err);
          reject(err);
        } else {
          console.log('[DB] Success insert id:', this.lastID);
          resolve(this.lastID);
        }
      }
    );
  });
}

function createUser(email, password, name) {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) return reject(err);
      db.run(
        'INSERT INTO Users (email, password, name) VALUES (?, ?, ?)',
        [email, hash, name],
        function (err) {
          if (err) reject(err);
          else resolve(this.lastID);
        }
      );
    });
  });
}

module.exports = { saveUserJob, createUser }; 