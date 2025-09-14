import { Router } from "express";
import multer from "multer";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs";
import { guardarDeteccion } from "../controllers/deteccion.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);

const uploadDir = join(__dirname, "../uploads");
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadDir),
  filename:    (_, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

const fileFilter = (_, file, cb) => {
  const ok = ["image/png","image/jpeg","image/jpg"].includes(file.mimetype);
  cb(ok ? null : new Error("Tipo de archivo inválido. Solo PNG/JPEG/JPG."), ok);
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 10 * 1024 * 1024 } });

// campo form-data: imagen (tipo File)
router.post("/", verifyToken, upload.single("imagen"), guardarDeteccion);

export default router;
