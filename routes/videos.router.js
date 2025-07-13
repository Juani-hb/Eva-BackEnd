import { Router } from "express";
import multer from 'multer';
import { subirVideo } from "../controllers/videos.controller.js";
import { verifyToken } from "../middlewares/auth.middlewares.js";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const router = Router(); 

const files = fileURLToPath(import.meta.url);
const videos = dirname(files);

console.log('Inicializando router de videos');

const uploadDir = join(videos, "../videos");
console.log('Ruta para guardar archivos: ' + uploadDir);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log('Determinando destino del archivo');
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const filename = `${Date.now()}-${file.originalname}`;
    console.log('Generando nombre de archivo: ' + filename);
    cb(null, filename);
  }
});

const fileFilter = (req, file, cb) => {
  console.log('Verificando mimetype: ' + file.mimetype);
  const allowedTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/mkv'];
  if (allowedTypes.includes(file.mimetype)) {
    console.log('Tipo permitido');
    cb(null, true); 
  } else {
    console.log('Tipo NO permitido');
    cb(new Error('Tipo de archivo no permitido. Solo se aceptan mp4, avi, mov, mkv'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter
});

// Ruta para subir video
router.post("/", 
  (req, res, next) => {
    console.log('Llegó la request POST /video');
    next();
  },
  verifyToken,
  (req, res, next) => {
    console.log('Token verificado');
    next();
  },
  upload.single('file'),
  (req, res, next) => {
    console.log('Archivo procesado por Multer');
    next();
  },
  subirVideo
);

export default router;

router.get('/ping', (req, res) => {
  console.log('Llegó GET /video/ping');
  res.send('pong');
});