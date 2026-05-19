const { validate } = require("jest-validate");

function validateCharacter(character) {
    const { name, bounty } = character;

    if (!name || name.trim() === "") {
        return "Character name is required";
    }

    if (bounty !== undefined && bounty !== null && bounty !== "") {
        if (isNaN(Number(bounty))) {
            return "Bounty must be a number.";
        }

        if (Number(bounty) < 0) {
            return "Bounty cannot be negative.";
        }
    }

    return null;
}

function getAllCharacters(filters) {
    return new Promise((resolve, reject) => {
        const { search, affiliation, sort } = filters;

        let sql = "SELECT * FROM characters WHERE 1 = 1";
        const params = [];

        if (search) {
            sql += " AND name LIKE ?";
            params.push(`%${search}%`);
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
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

function getCharacterById(id) {
    return new Promise((resolve, reject) => {
        db.get(
            "SELECT * FROM characters WHERE id = ?",
            [id],
            (err, character) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(character);
                }
            }
        );
    });
}

function createCharacter(character) {
    return new Promise((resolve, reject) => {
        const { name, affiliation, bounty, status } = character;
        const finalBounty = bounty || 0;

        const sql = `
            INSERT INTO characters (name, affiliation, bounty, status)
            VALUES (?, ?, ?, ?)
        `;
        
        db.run(sql, [name, affiliation, finalBounty, status], function (err) {
            if (err) {
                reject(err);
            } else {
                resolve({
                    id: this.lastID,
                    name,
                    affiliation,
                    bounty: finalBounty,
                    status
                });
            }
        });
    });
}

function updateCharacter(id, character) {
    return new Promise((resolve, reject) => {
        const { name, affiliation, bounty, status } = character;
        const finalBounty = bounty || 0;

        const sql = `
            UPDATE characters
            SET name = ?, affiliation = ?, bounty = ?, status = ?
            WHERE id = ?
        `;

        db.run(sql, [name, affiliation, finalBounty, status, id], function(err) {
            if (err) {
                reject(err);
            } else {
                resolve({
                    changes: this.changes,
                    character: {
                        id: Number(id),
                        name,
                        affiliation,
                        bounty: finalBounty,
                        status
                    }
                });
            }
        });
    });
}

function deleteCharacter(id) {
    return new Promise((resolve, reject) => {
        db.run(
            "DELETE FROM characters WHERE id = ?",
            [id],
            function (err) {
                if (err) {
                    reject (err);
                } else {
                    resolve({ changes: this.changes });
                }
            }
        );
    });
}

module.exports = { validateCharacter, getAllCharacters, getCharacterById, createCharacter, updateCharacter, deleteCharacter};