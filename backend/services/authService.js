const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../database/db");

function findUserByUsernameOrEmail(identifier) {
    return new Promise((resolve, reject) => {
        db.get(
            "SELECT * FROM users WHERE username = ? OR email = ?",
            [identifier, identifier],
            (err, user) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(user);
                }
            }
        );
    });
}

function findExistingUser(username, email) {
    return new Promise((resolve, reject) => {
        db.get(
            "SELECT * FROM users WHERE username = ? OR email = ?",
            [username, email],
            (err, user) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(user);
                }
            }
        );
    });
}

function insertUser(username, email, hashedPassword) {
    return new Promise((resolve, reject) => {
        db.run(
            "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)",
            [username, email, hashedPassword, "user"],
            function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({
                        id: this.lastID,
                        username,
                        email,
                        role: "user"
                    });
                }
            }
        );
    });
}

async function registerUser(username, email, password) {
    if (!username || !email || !password) {
        return {
            success: false,
            statusCode: 400,
            message: "Username, email and password are required."
        }
    }

    if (username.trim().length < 3) {
        return {
            success: false,
            statusCode: 400,
            message: "Username must be at least 3 characters long."
        }
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(email)) {
        return {
            success: false,
            statusCode: 400,
            message: "Invaild email format."
        }
    }

    if (password.length < 8) {
        return {
            success: false,
            statusCode: 400,
            message: "Password must be at least 8 characters long."
        }
    }

    const existingUser = await findExistingUser(username, email);

    if (existingUser) {
        return {
            success: false,
            statusCode: 409,
            message: "Username or email already exists."
        }
    }

    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = await insertUser(username, email, hashedPassword);

    return {
        success: true,
        statusCode: 201,
        message: "User registered successfully.",
        user: newUser
    }
}

async function loginUser(identifier, password) {
    if (!identifier || !password) {
        return {
            success: false,
            statusCode: 400,
            message: "Username/email and password are required."
        }
    }

    const user = await findUserByUsernameOrEmail(identifier);

    if (!user) {
        return {
            success: false,
            statusCode: 401,
            message: "Invalid username/email or password."
        }
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        return {
            success: false,
            statusCode: 401,
            message: "Invalid username/email or password."
        }
    }

    const token = jwt.sign(
        {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN
        }
    );

    return {
        success: true,
        statusCode: 200,
        message: "Login succesful.",
        token,
        user: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role
        }
    }
}

module.exports = { loginUser, registerUser };