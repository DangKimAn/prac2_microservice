// src/index.js
const express = require("express");
const authenticate = require("./middleware/auth.js")
const { createProxyMiddleware } = require("http-proxy-middleware");
const rateLimit = require("express-rate-limit");
const cors = require("cors");
const helmet = require("helmet");
const jwt = require("jsonwebtoken"); // <-- BỔ SUNG DÒNG NÀY

require("dotenv").config();
const app = express();

// --- BẢO MẬT CHUNG ---
app.use(helmet());
app.use(cors({ origin: process.env.ALLOWED_ORIGINS?.split(",") || "*" }));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use(limiter);

// Health check
app.get("/health", (req, res) => res.json({ status: "ok", gateway: true }));

app.use("/api/products", createProxyMiddleware({
    target: `http://product-service:${process.env.PRODUCT_SERVICE_PORT}/api/products`,
    changeOrigin: true,
    on: { error: (err, req, res) => res.status(503).json({ message: "Product Service không khả dụng" }) }
}));
app.use("/api/orders", authenticate, createProxyMiddleware({
    target: `http://order-service:${process.env.ORDER_SERVICE_PORT}/api/orders`,
    changeOrigin: true,

    on: {
        proxyReq: (proxyReq, req, res) => {
            console.log("--- ĐÃ VÀO PROXY REQ ---"); // Log này để kiểm tra
            if (req.user) {
                proxyReq.setHeader('x-user-id', String(req.user.id));
            } else {
                console.log("CẢNH BÁO: req.user đang bị undefined!");
            }
        }, error: (err, req, res) => res.status(503).json({ message: "Order Service không khả dụng" })
    }
}));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 API Gateway running on port ${PORT}`));