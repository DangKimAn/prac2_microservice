import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { use } from "react";

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

class PrismaService {

    constructor() {
        this.prisma = new PrismaClient({ adapter });
    }
    async findOneByUsername(username) {
        try {
            return await this.prisma.user.findUnique({
                where: {
                    username: username,
                },
            });
        } catch (error) {
            console.error("Lỗi khi truy vấn database:", error);
            throw error;
        }
    }

    async findOneByEmail(email) {
        try {
            return await this.prisma.user.findUnique({
                where: {
                    email: email,
                },
            })

        }
        catch (error) {
            console.error("Lỗi khi truy vấn database:", error);
            throw error;
        }
    }

    async register(username, email, hashedPassword, role = 'USER') {
        try {
            return await this.prisma.user.create({
                data: {
                    username: username,
                    email: email,
                    password: hashedPassword,
                    role: role
                },
            });



        }
        catch (error) {
            console.error("Lỗi khi truy vấn database:", error);
            throw error;
        }
    }

    async updateRefreshToken({ user, refreshToken }) {
        try {
            return await this.prisma.user.update({
                where: {
                    username: user.username
                },
                data: {
                    token: refreshToken
                }
            })
        }
        catch (error) {
            console.error("Lỗi khi truy vấn database:", error);
            throw error;
        }
    }
}

export default new PrismaService();