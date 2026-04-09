import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

import redis from "../config/redis.js";

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });



// ──────────────────────────────────
// GET /api/products — Lấy danh sách có phân trang, lọc, sắp xếp
// ──────────────────────────────────
const getProducts = async (req, res, next) => {
    try {
        const {
            page = 1, limit = 10,
            search = "", category,
            sortBy = "createdAt", order = "desc",
            minPrice, maxPrice, inStock
        } = req.query;

        const cacheKey = `products:${JSON.stringify(req.query)}`;
        const cachedData = await redis.get(cacheKey);

        if (cachedData) {
            console.log("Data from Redis cache");
            return res.json(JSON.parse(cachedData));
        }


        const skip = (parseInt(page) - 1) * parseInt(limit);
        // Xây dựng điều kiện filter
        const where = {
            isActive: true,
            ...(search && { name: { contains: search, mode: "insensitive" } }),
            ...(category && { category: { slug: category } }),
            ...(minPrice || maxPrice) && {
                price: {
                    ...(minPrice && { gte: parseFloat(minPrice) }),
                    ...(maxPrice && { lte: parseFloat(maxPrice) }),
                }
            },
            ...(inStock === "true" && { stock: { gt: 0 } }),
        };
        // Chạy song song 2 queries
        const [products, total] = await Promise.all([
            prisma.product.findMany({
                where,
                include: { category: { select: { name: true, slug: true } } },
                orderBy: { [sortBy]: order },
                skip,
                take: parseInt(limit),
            }),
            prisma.product.count({ where }),
        ]);

        // Save cache 5 phút
        const response = {
            success: true,
            data: products,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(total / parseInt(limit))
            }
        };

        await redis.set(
            cacheKey,
            JSON.stringify(response),
            "EX",
            300
        );

        res.json({
            success: true,
            data: products,
            pagination: {
                total, page: parseInt(page), limit: parseInt(limit),
                totalPages: Math.ceil(total / parseInt(limit))
            }
        });
    } catch (error) {
        next(error); // Chuyển lỗi sang errorHandler
    }
};
// ──────────────────────────────────
// GET /api/products/:id
// ──────────────────────────────────
const getProductById = async (req, res, next) => {
    try {
        const product = await prisma.product.findUnique({
            where: { id: parseInt(req.params.id) },
            include: { category: true },
        });
        if (!product) return res.status(404).json({ success: false, message: "Không tìm thấy sản phẩm" });
        res.json({ success: true, data: product });
    } catch (error) { next(error); }
};
// ──────────────────────────────────
// POST /api/products
// ──────────────────────────────────
const createProduct = async (req, res, next) => {
    try {
        const { name, price, description, stock, imageUrl, categoryId } = req.body;
        const slug = name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
        const product = await prisma.product.create({
            data: { name, slug, price, description, stock, imageUrl, categoryId },
            include: { category: true }
        });
        const keys = await redis.keys("products:*");
        if (keys.length > 0) {
            await redis.del(...keys);
        }
        res.status(201).json({ success: true, data: product, message: "Tạo sản phẩm thành công" });
    } catch (error) { next(error); }
};
// ──────────────────────────────────
// PUT /api/products/:id
// ──────────────────────────────────
const updateProduct = async (req, res, next) => {
    try {
        const product = await prisma.product.update({
            where: { id: parseInt(req.params.id) },
            data: req.body,
            include: { category: true }
        });
        const keys = await redis.keys("products:*");
        if (keys.length > 0) {
            await redis.del(...keys);
        }
        res.json({ success: true, data: product, message: "Cập nhật thành công" });
    } catch (error) { next(error); }
};
// ──────────────────────────────────
// DELETE /api/products/:id (Soft delete)
// ──────────────────────────────────
const deleteProduct = async (req, res, next) => {
    try {
        await prisma.product.update({
            where: { id: parseInt(req.params.id) },
            data: { isActive: false } // Soft delete — không xoá thật
        });
        const keys = await redis.keys("products:*");
        if (keys.length > 0) {
            await redis.del(...keys);
        }
        res.json({ success: true, message: "Đã ẩn sản phẩm thành công" });
    } catch (error) { next(error); }
};
// ──────────────────────────────────
// POST /api/products/:id/image (Soft delete)
// ──────────────────────────────────

const postImge = async (req, res, next) => {
    if (!req.body.imageUrl)
        return res.status(400).send("imageUrl khong the null");
    try {
        const product = await prisma.product.findUnique({
            where: { id: parseInt(req.params.id) }
        })
        if (!product)
            return res.status(401).send("product khong ton tai");
        await prisma.product.update({
            where: { id: parseInt(req.params.id) },
            data: { imageUrl: req.body.imageUrl }
        });
        const keys = await redis.keys("products:*");
        if (keys.length > 0) {
            await redis.del(...keys);
        }
        return res.status(200).send("update image url thanh cong");

    } catch (error) { next(error) }
}
export {
    getProducts, getProductById, createProduct, updateProduct,
    deleteProduct, postImge
};
