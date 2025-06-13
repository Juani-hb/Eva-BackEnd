import { Router } from "express";
import multer from 'multer';
import { subirVideo } from "../controllers/videos.controller.js";
import { verifyToken } from "../middlewares/auth.middlewares.js";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const router = Router(); 

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const uploadDir = join(__dirname, "../uploads");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/mkv'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de archivo no permitido. Solo se aceptan mp4, avi, mov, mkv'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter
});

// Ruta para subir video
router.post("/", verifyToken, upload.single('file'), subirVideo);

export default router;
