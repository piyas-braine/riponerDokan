import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = path.join("public", "uploads", "products");

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Set up the storage engine
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); // Ensure consistent path
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, `${uniqueSuffix}-${file.originalname}`);
    },
});

// Configure the multer instance
const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5 MB file size limit
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype === "image/png" || file.mimetype === "image/jpeg") {
            cb(null, true);
        } else {
            cb(new Error("Only PNG and JPEG files are allowed"));
        }
    },
});

export default upload;