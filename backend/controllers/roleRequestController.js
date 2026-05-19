const roleRequestService = require("../services/roleRequestService");

async function createEditorRequest(req, res) {
    try {
        const userId = req.user.id;

        const result = await roleRequestService.createEditorRequest(userId);

        return res.status(result.statusCode).json({
            message: result.message,
            request: result.request
        });
    } catch (error) {
        console.error("Create editor request error:", error.message);

        return res.status(500).json({ message: "Internal server error." });
    }
}

module.exports = { createEditorRequest };