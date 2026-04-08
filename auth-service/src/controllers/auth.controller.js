import { use, useEffect } from "react";
import AuthService from "../services/auth.service.js";
import { json } from "express";
function isValidEmail(email) {
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    return emailRegex.test(email);
}
class AuthController {

    constructor() {
        this.authService = AuthService;
        this.register = this.register.bind(this);
        this.login = this.login.bind(this);
        this.refreshToken = this.refreshToken.bind(this);
        this.getMe = this.getMe.bind(this);
    }
    async register(req, res, next) {
        try {
            const { username, email, password, passwordAgain } = req.body
            if (!username || !email || !password || !passwordAgain)
                return res.status(500).send("Email or username or password is empty ! pls try a again")
            if (!isValidEmail(email))
                return res.status(501).send("It is not valid email ! pls try a again");

            if (password !== passwordAgain)
                return res.status(502).send("The password is not same password again ! pls try again")
            return await this.authService.register({ res, username, email, password });
        }
        catch (error) {
            next(error)
        }

        return res.status(200).send("success")
    }
    async login(req, res, next) {
        try {
            const { username, password } = req.body;
            if (!username || !password)
                return res.status(500).send("username or password is empty ! pls try a again")

            const result = await this.authService.login({ username, password });
            if (!result) return res.status(401).send("Login failed");
            const { user, ...tokens } = result;
            return res.status(200).json({
                message: 'Login successful',
                ...tokens
            });


        }
        catch (error) {
            next(error)
        }
    }

    async refreshToken(req, res, next) {
        try {
            const { refreshToken } = req.body;
            return this.authService.refreshToken(res, refreshToken);
        }
        catch (error) {
            next(error)
        }
    }

    async getMe(req, res, next) {
       
        const username = req.user.username;
        return this.authService.getMe(res, username)
    }

}

export default new AuthController()