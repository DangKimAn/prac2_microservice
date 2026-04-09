const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const swaggerUi = require("swagger-ui-express");
const orderRoutes = require("./routes/orderRoutes");
const swaggerSpec = require("./swagger/swagger");

const app = express();

// --- Middlewares ---
// Cho phép các domain khác truy cập (CORS)
app.use(cors());

// Log các request đến terminal để dễ theo dõi
app.use(morgan("dev"));

// Body parser: Đọc dữ liệu JSON từ request body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Routes ---
app.use("/api/orders", orderRoutes);

// Route mặc định kiểm tra server
app.get("/", (req, res) => {
    res.json({ message: "Order Service API is running..." });
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use((err, req, res, next) => {
    console.error(err.stack);
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        success: false,
        message: err.message || "Lỗi máy chủ nội bộ",
        // Chỉ hiện lỗi chi tiết khi đang ở môi trường phát triển
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined
    });
});

module.exports = app;