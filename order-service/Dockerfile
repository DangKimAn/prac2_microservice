# Sử dụng base image Alpine siêu nhẹ
FROM node:18-alpine

WORKDIR /app

# Copy package.json để cài đặt thư viện trước (tối ưu cache Docker)
COPY package*.json ./

# Chỉ cài các thư viện cần cho lúc chạy thực tế (bỏ qua devDependencies)
RUN npm install --production

# Copy toàn bộ source code
COPY . .

# Mở cổng 5000 (cổng mà Express đang chạy bên trong container)

# Khởi chạy ứng dụng
CMD ["sh" , "-c", "npm run dev"]