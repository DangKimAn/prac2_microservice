/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Tạo đơn hàng mới
 *     tags:
 *       - Orders
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - customerId
 *               - customerName
 *               - customerEmail
 *               - items
 *               - shippingAddress
 *             properties:
 *               customerId:
 *                 type: integer
 *                 example: 1
 *               customerName:
 *                 type: string
 *                 example: Nguyễn Văn A
 *               customerEmail:
 *                 type: string
 *                 example: nguyenvana@gmail.com
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: integer
 *                       example: 101
 *                     productName:
 *                       type: string
 *                       example: iPhone 15
 *                     price:
 *                       type: number
 *                       example: 25000000
 *                     quantity:
 *                       type: integer
 *                       example: 2
 *               shippingAddress:
 *                 type: string
 *                 example: 123 Lê Lợi, Quận 1, TP.HCM
 *               note:
 *                 type: string
 *                 example: Giao hàng giờ hành chính
 *     responses:
 *       201:
 *         description: Tạo đơn hàng thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       500:
 *         description: Lỗi server
 *
 * /api/orders/customer/{customerId}:
 *   get:
 *     summary: Lấy danh sách đơn hàng theo khách hàng
 *     tags:
 *       - Orders
 *     parameters:
 *       - in: path
 *         name: customerId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của khách hàng
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Lọc theo trạng thái đơn hàng
 *     responses:
 *       200:
 *         description: Lấy danh sách đơn hàng thành công
 *       404:
 *         description: Không tìm thấy đơn hàng
 *       500:
 *         description: Lỗi server
 *
 * /api/orders/{id}/status:
 *   put:
 *     summary: Cập nhật trạng thái đơn hàng
 *     tags:
 *       - Orders
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của đơn hàng
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 example: shipped
 *     responses:
 *       200:
 *         description: Cập nhật trạng thái thành công
 *       404:
 *         description: Không tìm thấy đơn hàng
 *       500:
 *         description: Lỗi server
 */