const jwt = require("jsonwebtoken");
const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Chưa đăng nhập" });
    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch {
        res.status(401).json({ message: "Token không hợp lệ hoặc đã hết hạn" });
    }
};
// Áp dụng cho các route cần xác thực
app.use("/api/orders", authenticate, createProxyMiddleware({
    target:
        ORDER_SERVICE_URL
}));