const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = require("./app");

// Cấu hình biến môi trường
dotenv.config();

const PORT = process.env.ORDER_SERVICE_PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/order_db";

// --- Kết nối MongoDB ---
mongoose
    .connect(MONGO_URI)
    .then(() => {
        console.log("✅ Kết nối MongoDB thành công!");
        
        // Chỉ chạy server khi đã kết nối DB thành công
        app.listen(PORT, () => {
            console.log(`🚀 Server đang chạy tại: http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error("❌ Lỗi kết nối MongoDB:", err.message);
        process.exit(1); // Dừng app nếu không kết nối được DB
    });

// Xử lý các lỗi treo server chưa được bắt (Uncaught Exceptions)
process.on("unhandledRejection", (err) => {
    console.log("❌ Unhandled Rejection! Đang đóng server...");
    console.log(err.name, err.message);
    process.exit(1);
});