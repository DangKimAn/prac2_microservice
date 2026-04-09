const app = require("./app"); // Nhập app đã cấu hình xong
require("dotenv").config();

// Bạn nên để Product Service chạy ở cổng khác 3000 (ví dụ 4000) 
// để chừa cổng 3000 cho API Gateway
const PORT = process.env.PRODUCT_SERVICE_PORT || 4000; 

app.listen(PORT, () => {
  console.log(`✅ Product Service đang chạy trên port ${PORT}`);
});