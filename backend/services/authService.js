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

module.exports = { loginUser };