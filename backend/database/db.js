const sqlite = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.join(__dirname, "onepiece.db");

const db = new sqlite.Database(dbPath, (err) => {
    if (err) {
        console.error("Database connection error:", err.message);
    } else {
        console.log("Connected to SQLite database");
    }
});

db.serialize(() => {
    db.run("PRAGMA foreign_keys = ON");

    db.run(`CREATE TABLE IF NOT EXISTS characters (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        affiliation TEXT,
        bounty INTEGER DEFAULT 0,
        status TEXT
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'user' CHECK(role IN ('user', 'editor', 'admin')),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS role_requests (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        requested_role TEXT NOT NULL DEFAULT 'editor' CHECK(requested_role IN ('editor')),
        status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'approved', 'rejected')),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        reviewed_by INTEGER,
        reviewed_at DATETIME,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL
    )`);
});

module.exports = db;