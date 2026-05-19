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

async function getPendingRequests(req, res) {
    try {
        const requests = await roleRequestService.getPendingRequests();

        return res.status(200).json({ requests });
    } catch (error) {
        console.error("Get pending requests error:", error.message);

        return res.status(500).json({ message: "Internal server error." });
    }
}

async function reviewEditorRequest(req, res) {
    try {
        const requestId = req.params.id;
        const adminId = req.user.id;
        const { decision } = req.body;

        const result = await roleRequestService.reviewEditorRequest(requestId, adminId, decision);

        return res.status(result.statusCode).json({ message: result.message });
    } catch (error) {
        console.error("Review editor request error:", error.message);

        return res.status(500).json({ message: "Internal server error." });
    }
}

module.exports = { createEditorRequest, getPendingRequests, reviewEditorRequest };