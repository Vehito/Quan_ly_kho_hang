import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/imgs/temp_uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname); // bạn có thể đổi tên nếu muốn
    }
});

export const upload = multer({ storage });