const express = require("express");
const roleRequestController = require("../controllers/roleRequestController");
const { authenticateToken, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * @swagger
 * /api/role-requests:
 *   post:
 *     summary: Request editor role
 *     tags:
 *       - Role Requests
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Editor role request created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Editor role request created successfully.
 *                 request:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     user_id:
 *                       type: integer
 *                       example: 2
 *                     requested_role:
 *                       type: string
 *                       example: editor
 *                     status:
 *                       type: string
 *                       example: pending
 *       400:
 *         description: User already has edit permission or invalid request
 *       401:
 *         description: Token is required
 *       403:
 *         description: Invalid or expired token
 *       409:
 *         description: User already has a pending editor request
 *       500:
 *         description: Internal server error
 */
router.post("/", authenticateToken, roleRequestController.createEditorRequest);

router.get("/pending", authenticateToken, authorizeRoles("admin"), roleRequestController.getPendingRequests);

router.put("/:id/review", authenticateToken, authorizeRoles("admin"), roleRequestController.reviewEditorRequest);

module.exports = router;