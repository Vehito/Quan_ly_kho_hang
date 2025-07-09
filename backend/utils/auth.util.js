import * as jwt from 'jsonwebtoken';
import dotenv from "dotenv";
dotenv.config();

export function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1];

    if(!token) return res.status(400).json({
        message: 'Truy cập không được cho phép'
    });

    jwt.verify(token, SECRET, (err, user) => {
        if (err) return res.sendStatus(403).json({
            message: 'Thông tin người dùng không hợp lệ'
        });
        req.user = user; // Lưu vào request
        next();
    });
}