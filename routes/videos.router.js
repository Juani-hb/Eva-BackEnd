import { Router } from "express";
import multer from 'multer';
import { videoController } from "../controllers/videos.controller.js";
import { verifyToken } from "../middlewares/auth.middlewares.js";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const router = Router(); 

const files = fileURLToPath(import.meta.url);
const videos = dirname(files);

console.log('Iniciando router de videos');

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
  fileFilter: fileFilter,
  limits: { fileSize: 100 * 1024 * 1024 } // 100MB límite
});

// // Middleware para capturar errores de Multer y otros
// router.use((err, req, res, next) => {
//   console.error("Error en la ruta de video:", err.message);

//   if (err instanceof multer.MulterError) {
//     return res.status(400).json({ error: "Error de Multer: " + err.message });
//   }

//   if (err.message === "Tipo de archivo no permitido. Solo se aceptan mp4, avi, mov, mkv") {
//     return res.status(400).json({ error: err.message });
//   }

//   return res.status(500).json({ error: "Error interno del servidor." });
// });

// Ruta para subir video
router.post("/", verifyToken, upload.single('file'), videoController.subirVideo);

router.get('/ping', (req, res) => {
  console.log('Llegó GET /video/ping');
  res.send('pong');
});

export default router;
