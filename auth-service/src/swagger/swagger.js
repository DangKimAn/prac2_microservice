// src/swagger/swagger.js
import swaggerJsdoc from "swagger-jsdoc";
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Product Service API",
            version: "1.0.0",
            description: "API quản lý sản phẩm — Lab 2 Nâng cao",
            contact: { name: "Dev Team", email: "dev@example.com" }
        },
        servers: [
            { url: "http://localhost:3001", description: "Development" },
            { url: "https://auth-service.railway.app", description: "Auth" }
        ],
        components: {
           
        }
    },
    // Tự động scan JSDoc comments từ các file route
    apis: ["./src/routes/*.js"],
};
const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;