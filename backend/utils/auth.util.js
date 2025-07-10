import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
dotenv.config();

export function authenticateToken(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: 'Truy cập không được cho phép' });
    }

    jwt.verify(token, process.env.SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Thông tin người dùng không hợp lệ' });
        }
        req.user = user;
        next();
    });
}