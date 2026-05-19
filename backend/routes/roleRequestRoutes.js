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

/**
 * @swagger
 * /api/role-requests/pending:
 *   get:
 *     summary: Get pending editor role requests
 *     tags:
 *       - Role Requests
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Pending role requests retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 requests:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       user_id:
 *                         type: integer
 *                         example: 2
 *                       username:
 *                         type: string
 *                         example: zoro
 *                       email:
 *                         type: string
 *                         example: zoro@example.com
 *                       requested_role:
 *                         type: string
 *                         example: editor
 *                       status:
 *                         type: string
 *                         example: pending
 *                       created_at:
 *                         type: string
 *                         example: 2026-05-19 12:30:00
 *       401:
 *         description: Token is required
 *       403:
 *         description: Admin permission is required
 *       500:
 *         description: Internal server error
 */
router.get("/pending", authenticateToken, authorizeRoles("admin"), roleRequestController.getPendingRequests);

/**
 * @swagger
 * /api/role-requests/{id}/review:
 *   put:
 *     summary: Approve or reject an editor role request
 *     tags:
 *       - Role Requests
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Role request ID
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - decision
 *             properties:
 *               decision:
 *                 type: string
 *                 enum:
 *                   - approved
 *                   - rejected
 *                 example: approved
 *     responses:
 *       200:
 *         description: Role request reviewed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Editor role request approved successfully.
 *       400:
 *         description: Invalid decision or request already reviewed
 *       401:
 *         description: Token is required
 *       403:
 *         description: Admin permission is required
 *       404:
 *         description: Role request not found
 *       500:
 *         description: Internal server error
 */
router.put("/:id/review", authenticateToken, authorizeRoles("admin"), roleRequestController.reviewEditorRequest);

module.exports = router;