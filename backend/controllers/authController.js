const authService = require("../services/authService");

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

module.exports = { login };