const { error } = require("node:console");
const db = require("../database/db");
const { validateCharacter } = require("../services/characterService");
const { stat } = require("node:fs");


exports.getAllCharacters = (req, res) => {
    const { search, affiliation, sort } = req.query;

    let sql = "SELECT * FROM characters WHERE 1=1";
    const params = [];

    if (search) {
        sql += " AND name LIKE ?";
        params.push(`%${search}`);
    }

    if (affiliation) {
        sql += " AND affiliation = ?";
        params.push(affiliation);
    }

    if (sort === "bounty") {
        sql += " ORDER BY bounty DESC";
    } else {
        sql += " ORDER BY id DESC";
    }

    db.all(sql, params, (err, rows) => {
        if (err) {
            return res.status(500).json({ message: "Database error", error: err.message });
        }

        res.status(200).json(rows);
    })
};

exports.getCharacterById = (req, res) => {
    const id = Number(req.params.id);
    
    db.get("SELECT * FROM characters WHERE id = ?", [id], (err, row) => {
        if (err) {
            return res.status(500).json({ message: "Database error", error: err.message });
        }

        if (!row) {
            return res.status(404).json({ message: "Character not found" });
        }

        res.status(200).json(row);
    });
};

exports.createCharacter = (req, res) => {
    const { name, affiliation, bounty, status } = req.body;

    const validationError = validateCharacter(req.body);

    if (validationError) {
        return res.status(400).json({ message: validationError });
    }

    const sql = `
        INSERT INTO characters (name, affiliation, bounty, status)
        VALUES (?, ?, ?, ?)
    `;

    db.run(sql, [name, affiliation, bounty || 0, status], function (err) {
        if (err) {
            return res.status(500).json({ message: "Database error", error: err.message });
        }

        res.status(201).json({
            id: this.lastID,
            name,
            affiliation,
            bounty: bounty || 0,
            status
        });
    });
};

exports.updateCharacter = (req, res) => {
    const id = Number(req.params.id);
    const { name, affiliation, bounty, status } = req.body;

    const validationError = validateCharacter(req.body);

    if (validationError) {
        return res.status(400).json({ message: validationError });
    }

    const sql = `
        UPDATE characters
        SET name = ?, affiliation = ?, bounty = ?, status = ?
        WHERE id = ?
    `;

    db.run(sql, [name, affiliation, bounty || 0, status, id], function (err) {
        if (err) {
            return res.status(500).json({ message: "Database error", error: err.message });
        }

        if (this.changes === 0) {
            return res.status(404).json({ message: "Character not found" });
        }

        res.status(200).json({
            id: Number(id),
            name,
            affiliation,
            bounty: bounty || 0,
            status
        });
    });
};

exports.deleteCharacter = (req, res) => {
    const id = Number(req.params.id);

    db.run("DELETE FROM characters WHERE id = ?", [id], function (err) {
        if (err) {
            return res.status(500).json({ message: "Database error", error: err.message });
        }

        if (this.changes === 0) {
            return res.status(404).json({ message: "Character not found" });
        }

        res.status(200).json({ message: "Character deleted successfully"});
    });
};