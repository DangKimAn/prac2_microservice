import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swagger/swagger.js";
import router from "./routes/auth.routes.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/api-docs.json", (req, res) => res.json(swaggerSpec));

app.get("/health", (req, res) =>
    res.json({
        status: "ok",
        service: process.env.SERVICE_NAME,
        uptime: process.uptime()
    })
);

app.use("/api/auth", router);

export default app;