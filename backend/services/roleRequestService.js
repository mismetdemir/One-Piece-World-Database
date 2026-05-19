const { request } = require("express");
const db = require("../database/db");

function findUserById(userId) {
    return new Promise((resolve, reject) => {
        db.get(
            "SELECT id, username, email, role FROM users WHERE id = ?",
            [userId],
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

function findPendingRequestByUserId(userId) {
    return new Promise((resolve, reject) => {
        db.get(
            "SELECT * FROM role_requests WHERE user_id = ? AND status = 'pending'",
            [userId],
            (err, request) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(request);
                }
            }
        );
    });
}

function insertRoleRequest(userId) {
    return new Promise((resolve, reject) => {
        db.run(
            "INSERT INTO role_requests (user_id, requested_role, status) VALUES (?, ?, ?)",
            [userId, "editor", "pending"],
            function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({
                        id: this.lastID,
                        user_id: userId,
                        requested_role: "editor",
                        status: "pending"
                    });
                }
            }
        );
    });
}

async function createEditorRequest(userId) {
    if (!userId) {
        return {
            status: false,
            statusCode: 400,
            message: "User ID is required."
        }
    }

    const user = await findUserById(userId);

    if (!user) {
        return {
            success: false,
            statusCode: 404,
            message: "User not found."
        }
    }

    if (user.role === "admin" || user.role === "editor") {
        return {
            success: false,
            statusCode: 400,
            message: "This user already has permission."
        }
    }

    const existingPendingRequest = await findPendingRequestByUserId(userId);

    if (existingPendingRequest) {
        return {
            success: false,
            statusCode: 409,
            message: "You already have a pending request."
        }
    }

    const request = await insertRoleRequest(userId);

    return {
        success: true,
        statusCode: 201,
        message: "Role request created successfully.",
        request
    }
}

module.exports = { createEditorRequest };