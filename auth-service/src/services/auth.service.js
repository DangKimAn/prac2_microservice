
import bcrypt, { hash } from "bcrypt"
import PrismaService from "./prisma.service.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { use } from "react";
dotenv.config();
class AuthService {
    constructor() {
        this.prismaService = PrismaService;
    }

    async hashPassword(password) {
        const saltRounds = 10;
        return await bcrypt.hash(password, saltRounds);
    };

    async register({ res, username, email, password }) {
        if (await this.prismaService.findOneByUsername(username))
            return res.status(400).send("The username is exists ! pls try again")

        if (await this.prismaService.findOneByEmail(email))
            return res.status(401).send("The email is exists ! pls try again")

        const hashed = await this.hashPassword(password)
        console.log(hashed)
        const user = this.prismaService.register(username, email, hashed)
        if (user)
            return res.status(201).send("create user successfull")
        else
            return res.status(402).send("create user not  successfull")


    }
    async login({ username, password }) {

        const user = await this.prismaService.findOneByUsername(username)
        if (!user)
            return undefined;

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
            return undefined;

        const accessToken = jwt.sign(
            {
                id: user.id,
                username: user.username,
                role: user.role
            },
            process.env.JWT_ACCESS_SECRET,
            {
                expiresIn: "15m"
            }
        );
        const refreshToken = jwt.sign(
            {
                id: user.id,
                username:user.username,
                role:user.role
            },
            process.env.JWT_REFRESH_SECRET,
            {
                expiresIn: "7d"
            }
        )
        await this.prismaService.updateRefreshToken({ user, refreshToken });
        return { user, accessToken, refreshToken };
    }


    async refreshToken(res, incomingRefreshToken) {
        if (!incomingRefreshToken) {
            return res.status(400).json({ message: "Thiếu Refresh Token" });
        }

        try {
            // 2. Verify token (Input: token + Refresh Secret)
            const decoded = jwt.verify(incomingRefreshToken, process.env.JWT_REFRESH_SECRET);

            const user = await this.prismaService.findOneByUsername(decoded.username);

            if (!user) {
                return res.status(401).json({ message: "User không tồn tại" });
            }

            const newAccessTokenPayload = {
                id: user._id,
                role: user.role, // Cập nhật role mới nhất từ CSDL
                username: user.username,
            };

            const newAccessToken = jwt.sign(
                newAccessTokenPayload,
                process.env.JWT_ACCESS_SECRET,
                { expiresIn: '15m' } // Access Token chỉ sống ngắn hạn (15 phút)
            );

            // Trả về cho Client
            return res.status(200).json({
                accessToken: newAccessToken
            });

        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                return res.status(402).json({ message: "Refresh token đã hết hạn, vui lòng đăng nhập lại" });
            }
            return res.status(403).json({ message: "Refresh token không hợp lệ" });
        }
    }

    async getMe(res, username){
         console.log(username)
         try {
                       
            const user = await this.prismaService.findOneByUsername(username);

            if (!user) {
                return res.status(401).json({ message: "User không tồn tại" });
            }
            
            return res.status(200).json(user);

        } catch (error) {
            return res.status(403).json({ message: "Access token không hợp lệ" });
        }
    }


}

export default new AuthService();