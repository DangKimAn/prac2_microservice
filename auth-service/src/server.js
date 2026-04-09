import app from "./app.js"
import dotenv from "dotenv";

dotenv.config();
const PORT = process.env.AUTH_SERVICE_PORT || 4000; 

app.listen(PORT, () => {
  console.log(`✅ Product Service đang chạy trên port ${PORT}`);
});