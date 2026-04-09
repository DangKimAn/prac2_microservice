FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install

ARG DATABASE_URL
ARG DIRECT_URL

ENV DATABASE_URL=$DATABASE_URL
ENV DIRECT_URL=$DIRECT_URL

COPY . .
# 1. Sinh Prisma Client (bắt buộc trước khi build app)
RUN npx prisma generate

# 2. Ép buộc xóa sạch DB, áp dụng lại toàn bộ migration cũ và KHÔNG đòi hỏi tương tác
RUN npx prisma migrate reset --force 
RUN npx prisma migrate dev --name init                                                                                       ─╯
RUN npx prisma db seed
CMD ["sh", "-c", " npm run dev"]