import AuthController from "../controllers/auth.controller.js";
import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import authController from "../controllers/auth.controller.js";
const router = express.Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Đăng kí tài khoản
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - username
 *               - password
 *               - passwordAgain
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               passwordAgain:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tạo thành công
 *       400:
 *         description: Email bị trùng
 *       401:
 *         description: Username bị trùng
 *       402:
 *         description: Tạo không thành công
 *       500:
 *         description: Bị thiếu dữ liệu
 *       501:
 *         description: Email không hợp lệ
 *       502:
 *         description: Password phải trùng với passwordAgain
 *
 * /api/auth/login:
 *   post:
 *     summary: Đăng nhập
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Đăng nhập thành công
 *       401:
 *         description: Sai tài khoản hoặc mật khẩu
 * 
 /api/auth/refreshToken:
 *   post:
 *     summary: refresh access token
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Tạo access token thành công
 *       400:
 *         description: Thiếu Refresh Token
 *       401:
 *         description: User không tồn tại
 *       402:
 *         description: Refresh token đã hết hạn, vui lòng đăng nhập lại
 *       403:
 *         description: Refresh token không hợp lệ
 * /api/auth/me:
 *   get:
 *     summary: get my infor
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Tạo access token thành công
 *       401:
 *         description: User không tồn tại
 *       402:
 *         description: Access token đã hết hạn, vui lòng đăng nhập lại
 *       403:
 *         description: Access token không hợp lệ
 *       
 */
router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.post("/refreshToken", AuthController.refreshToken);
router.get('/me', authMiddleware, authController.getMe);
export default router