import express from "express";
import cors from "cors";
import db from './db.js';
import userRoutes from './routes/user.router.js';
import video from './routes/videos.router.js'

const app = express();
const port = 3000;

app.use(cors());
app.use(cors());
app.use(express.json());

app.use('/user', userRoutes); 
app.use('/video', video); 

app.listen(port, () => {
    console.log(`EVA is listening at http://localhost:${port}`);
});

app.get('/', (req, res) => {
  res.send('EVA API is working!');
});

// ⚠️ Este middleware va después de todas las rutas (¡dejalo al final de index.js!)
app.use((err, req, res, next) => {
  console.error("💥 Error no manejado:", err.stack || err);
  res.status(500).json({ error: "Error interno del servidor." });
});
