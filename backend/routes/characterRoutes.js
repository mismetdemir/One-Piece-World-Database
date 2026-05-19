const express = require("express");
const router = express.Router();

const characterController = require("../controllers/characterController");
const { authenticateToken, authorizeRoles } = require("../middleware/authMiddleware");

// ######################### Public routes #########################
/**
 * @swagger
 * /api/characters:
 *   get:
 *     summary: Get all characters
 *     tags:
 *       - Characters
 *     parameters:
 *       - in: query
 *         name: search
 *         required: false
 *         schema:
 *           type: string
 *         description: Search characters by name
 *         example: Luffy
 *       - in: query
 *         name: affiliation
 *         required: false
 *         schema:
 *           type: string
 *         description: Filter characters by affiliation
 *         example: Straw Hat Pirates
 *       - in: query
 *         name: sortByBounty
 *         required: false
 *         schema:
 *           type: string
 *           enum:
 *             - asc
 *             - desc
 *         description: Sort characters by bounty in ascending or descending order
 *         example: desc
 *     responses:
 *       200:
 *         description: Characters retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   name:
 *                     type: string
 *                     example: Monkey D. Luffy
 *                   affiliation:
 *                     type: string
 *                     example: Straw Hat Pirates
 *                   bounty:
 *                     type: integer
 *                     example: 3000000000
 *                   status:
 *                     type: string
 *                     example: Alive
 *       500:
 *         description: Internal server error
 */
router.get("/", characterController.getAllCharacters);

/**
 * @swagger
 * /api/characters/{id}:
 *   get:
 *     summary: Get a character by ID
 *     tags:
 *       - Characters
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Character ID
 *         example: 1
 *     responses:
 *       200:
 *         description: Character retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 name:
 *                   type: string
 *                   example: Monkey D. Luffy
 *                 affiliation:
 *                   type: string
 *                   example: Straw Hat Pirates
 *                 bounty:
 *                   type: integer
 *                   example: 3000000000
 *                 status:
 *                   type: string
 *                   example: Alive
 *       404:
 *         description: Character not found
 *       500:
 *         description: Internal server error
 */
router.get("/:id", characterController.getCharacterById);


// ######################### Protected routes #########################
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

/**
 * @swagger
 * /api/characters/{id}:
 *   put:
 *     summary: Update a character
 *     tags:
 *       - Characters
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Character ID
 *         example: 1
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
 *       200:
 *         description: Character updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Token is required
 *       403:
 *         description: Invalid token or permission denied
 *       404:
 *         description: Character not found
 *       500:
 *         description: Internal server error
 */
router.put("/:id", authenticateToken, authorizeRoles("admin", "editor"), characterController.updateCharacter);

/**
 * @swagger
 * /api/characters/{id}:
 *   delete:
 *     summary: Delete a character
 *     tags:
 *       - Characters
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Character ID
 *         example: 1
 *     responses:
 *       200:
 *         description: Character deleted successfully
 *       401:
 *         description: Token is required
 *       403:
 *         description: Invalid token or permission denied
 *       404:
 *         description: Character not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", authenticateToken, authorizeRoles("admin", "editor"), characterController.deleteCharacter);

module.exports = router;