const express = require("express");
const roleRequestController = require("../controllers/roleRequestController");
const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authenticateToken, roleRequestController.createEditorRequest);

module.exports = router;