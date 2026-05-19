const authService = require("../services/authService");

async function register(req, res) {
    try {
        const { username, email, password } = req.body;

        const result = await authService.registerUser(username, email, password);

        return res.status(result.statusCode).json({
            message: result.message,
            user: result.user
        });
    } catch (error) {
        console.error("Register error:", error.message);

        return res.status(500).json({
            message: "Internal server error."
        });
    }
}

async function login(req, res) {
    try {
        const { identifier, password } = req.body;

        const result = await authService.loginUser(identifier, password);

        return res.status(result.statusCode).json({
            message: result.message,
            token: result.token,
            user: result.user
        });
    } catch (error) {
        console.error("Login error:", error.message);

        return res.status(500).json({
            message: "Internal server error."
        });
    }
}

module.exports = { login, register };