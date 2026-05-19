const express = require("express");
const router = express.Router();

const characterController = require("../controllers/characterController");
const { authenticateToken, authorizeRoles } = require("../middleware/authMiddleware");

// Public routes
router.get("/", characterController.getAllCharacters);
router.get("/:id", characterController.getCharacterById);

// Protected routes
router.post("/", authenticateToken, authorizeRoles("admin", "editor"), characterController.createCharacter);
router.put("/:id", authenticateToken, authorizeRoles("admin", "editor"), characterController.updateCharacter);
router.delete("/:id", authenticateToken, authorizeRoles("admin", "editor"), characterController.deleteCharacter);

module.exports = router;