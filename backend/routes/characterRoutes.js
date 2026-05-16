const express = require("express");
const router = express.Router();

const characterController = require("../controllers/characterController");
const authenticateToken = require("../middleware/authMiddleware");

// Public routes
router.get("/", characterController.getAllCharacters);
router.get("/:id", characterController.getCharacterById);

// Protected routes
router.post("/", authenticateToken, characterController.createCharacter);
router.put("/:id", authenticateToken, characterController.updateCharacter);
router.delete("/:id", authenticateToken, characterController.deleteCharacter);

module.exports = router;