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
            success: false,
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

function getPendingRequests() {
    return new Promise((resolve, reject) => {
        db.all(`
            SELECT
                role_requests.id,
                role_requests.user_id,
                users.username,
                users.email,
                role_requests.requested_role,
                role_requests.status,
                role_requests.created_at
            FROM role_requests
            JOIN users ON role_requests.user_id = users.id
            WHERE role_requests.status = 'pending'
            ORDER BY role_requests.created_at ASC`,
            [],
            (err, requests) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(requests);
                }
            }
        );
    });
}

function findRoleRequestById(requestId) {
    return new Promise((resolve, reject) => {
        db.get(`
            SELECT
                role_requests.*,
                users.role AS user_role
            FROM role_requests
            JOIN users ON role_requests.user_id = users.id
            WHERE role_requests.id = ?`,
            [requestId],
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

function approveRequest(requestId, adminId, userId) {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            db.run("BEGIN TRANSACTION");

            db.run(`
                UPDATE role_requests
                SET status = 'approved',
                    reviewed_by = ?,
                    reviewed_at = CURRENT_TIMESTAMP
                WHERE id = ?`,
                [adminId, requestId],
                function (err) {
                    if (err) {
                        db.run("ROLLBACK");
                        return reject(err);
                    }

                    db.run(
                        "UPDATE users SET role = 'editor' WHERE id = ?",
                        [userId],
                        function (err) {
                            if (err) {
                                db.run("ROLLBACK");
                                return reject(err);
                            }

                            db.run("COMMIT", (err) => {
                                if (err) {
                                    return reject(err);
                                }

                                resolve();
                            });
                        }
                    );
                }
            );
        });
    });
}

function rejectRequest(requestId, adminId) {
    return new Promise((resolve, reject) => {
        db.run(`
            UPDATE role_requests
            SET status = 'rejected',
                reviewed_by = ?,
                reviewed_at = CURRENT_TIMESTAMP
            WHERE id = ?`,
            [adminId, requestId],
            function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            }
        );
    });
}

async function  reviewEditorRequest(requestId, adminId, decision) {
    if (!requestId || !decision) {
        return {
            success: false,
            statusCode: 400,
            message: "Request ID and decision are required."
        }
    }

    if (decision !== "approved" && decision !== "rejected") {
        return {
            success: false,
            statusCode: 400,
            message: "Decision must be either approved or rejected."
        }
    }

    const request = await findRoleRequestById(requestId);

    if (!request) {
        return {
            success: false,
            statusCode: 404,
            message: "Role request not found."
        }
    }

    if (request.status !== "pending") {
        return {
            success: false,
            statusCode: 400,
            message: "This role request has already been reviewed."
        };
    }

    if (decision === "approved") {
        await approveRequest(requestId, adminId, request.user_id);

        return {
            success: true,
            statusCode: 200,
            message: "Editor role request approved successfully."
        }
    } else {
        await rejectRequest(requestId, adminId);

        return {
            success: true,
            statusCode:200,
            message: "Editor role request rejected successfully."
        }
    }
}

module.exports = { createEditorRequest, getPendingRequests, reviewEditorRequest };