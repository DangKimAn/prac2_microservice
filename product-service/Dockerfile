# Dockerfile (dùng chung cho product-service và order-service)
# Dùng multi-stage build để giảm kích thước image
# Stage 1: Build
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
# Chỉ áp dụng cho product-service (có Prisma)
COPY prisma ./prisma
RUN npx prisma generate

