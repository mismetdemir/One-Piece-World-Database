const express = require("express");
const router = express.Router();

const characterController = require("../controllers/characterController");
const { authenticateToken, authorizeRoles } = require("../middleware/authMiddleware");

// Public routes
router.get("/", characterController.getAllCharacters);
router.get("/:id", characterController.getCharacterById);

// Protected routes
/**
 * @swagger
 * /api/characters:
 *   post:
 *     summary: Create a new character
 *     tags:
 *       - Characters
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Monkey D. Luffy
 *               affiliation:
 *                 type: string
 *                 example: Straw Hat Pirates
 *               bounty:
 *                 type: integer
 *                 example: 3000000000
 *               status:
 *                 type: string
 *                 example: Alive
 *     responses:
 *       201:
 *         description: Character created successfully
 *       401:
 *         description: Token is required
 *       403:
 *         description: Invalid token or permission denied
 */
router.post("/", authenticateToken, authorizeRoles("admin", "editor"), characterController.createCharacter);
router.put("/:id", authenticateToken, authorizeRoles("admin", "editor"), characterController.updateCharacter);
router.delete("/:id", authenticateToken, authorizeRoles("admin", "editor"), characterController.deleteCharacter);

module.exports = router;