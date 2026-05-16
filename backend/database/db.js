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
        role TEXT DEFAULT 'user',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);
});

module.exports = db;