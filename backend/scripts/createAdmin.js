require("dotenv").config();

const bcrypt = require("bcryptjs");
const db = require("../database/db");

const username = process.env.ADMIN_USERNAME;
const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;

if (!username || !email || !password) {
    console.error("Missing admin credentials. Please check ADMIN_USERNAME, ADMIN_EMAIL and ADMIN_PASSWORD in .env file.");
    process.exit(1);
}

const saltRounds = 12;

async function createAdmin() {
    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        db.get(
            "SELECT * FROM users WHERE username = ? OR email = ?",
            [username, email],
            (err, existingUser) => {
                if (err) {
                    console.error("Database error:", err.message);
                    process.exit(1);
                }

                if (existingUser) {
                    console.log("Admin user already exists with this username or email.");
                    db.close();
                    return;
                }
                
                db.run(
                    "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)",
                    [username, email, hashedPassword, "admin"],
                    function (err) {
                        if (err) {
                            console.error("Failed to create admin:", err.message);
                            process.exit(1);
                        }

                        console.log("Admin user created successfully.");
                        db.close();
                    }
                );
            }
        );
    } catch (error) {
        console.error("Error creating admin:", error.message);
        process.exit(1);
    }
}

createAdmin();