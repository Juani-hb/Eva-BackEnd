// routes/imagen.router.js
import { Router } from "express";
import multer from "multer";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs";
import { guardarDeteccion, listarDetecciones } from "../controllers/imagen.controller.js";
import { verifyToken } from "../middlewares/auth.middlewares.js";

const router = Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);

// si corre en Vercel/producción, usar /tmp (fs de solo lectura excepto /tmp)
const isProd = process.env.VERCEL === "1" || process.env.NODE_ENV === "production";
const uploadDir = isProd ? "/tmp" : join(__dirname, "../uploads");
try { fs.mkdirSync(uploadDir, { recursive: true }); } catch {}

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadDir),
  filename:    (_, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

const fileFilter = (_, file, cb) => {
  const ok = ["image/png", "image/jpeg", "image/jpg"].includes(file.mimetype);
  cb(ok ? null : new Error("Tipo de archivo inválido. Solo PNG/JPEG/JPG."), ok);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

// ✅ GET /deteccion -> listar (opcional ?page=&pageSize=)
router.get("/", verifyToken, listarDetecciones);

// ✅ POST /deteccion -> crear (form-data: imagen=File)
router.post("/", verifyToken, upload.single("imagen"), guardarDeteccion);

export default router;
