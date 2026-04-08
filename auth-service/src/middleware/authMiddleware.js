import jwt from "jsonwebtoken";
export default function authMiddleware (req, res, next) {
    const authHeader = req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: "Không tìm thấy token xác thực hoặc sai định dạng!" });
    }

    const token = authHeader.split(' ')[1]; 

    try {

        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        req.user = decoded; 
        next(); 
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(402).json({ message: "Access token đã hết hạn", code: "TOKEN_EXPIRED" });
        }
        return res.status(403).json({ message: "Token không hợp lệ" });
    }   
};
