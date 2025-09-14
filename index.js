import express from "express";
import cors from "cors";
import db from "./db.js";
import userRoutes from "./routes/user.router.js";
import imagenRouter from "./routes/imagen.router.js"; // antes se llamaba 'video'

const app = express();
const port = 3000;

app.use(cors());

// Rutas
app.use('/user', express.json(), userRoutes);

// Subida/registro de detecciones (POST /deteccion con form-data: imagen = File)
app.use('/deteccion', imagenRouter);

// Healthcheck
app.get('/', (req, res) => {
  res.send('EVA API is working!');
});

app.listen(port, () => {
  console.log(`EVA is listening at http://localhost:${port}`);
});
