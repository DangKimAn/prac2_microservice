# Dockerfile (dùng chung cho product-service và order-service)
# Dùng multi-stage build để giảm kích thước image
# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./

RUN npm install

COPY . .

ARG DATABASE_URL
ARG DIRECT_URL

ENV DATABASE_URL=$DATABASE_URL
ENV DIRECT_URL=$DIRECT_URL

RUN npx prisma generate
RUN npx prisma migrate reset --force
RUN npx prisma migrate dev --name init 

EXPOSE 3003

CMD ["sh" , "-c" , "BROWSER=none npx prisma studio --port 51212 & npm run dev"]