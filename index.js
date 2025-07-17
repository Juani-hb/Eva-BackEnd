import express from "express";
import cors from "cors";
import db from './db.js';
import userRoutes from './routes/user.router.js';
import video from './routes/videos.router.js';

const app = express();
const port = 3000;

app.use(cors());

// Solo para rutas que usan JSON
app.use('/user', express.json(), userRoutes);

// No uses express.json para /video (usa form-data)
app.use('/video', video);

app.listen(port, () => {
  console.log(`EVA is listening at http://localhost:${port}`);
});

app.get('/', (req, res) => {
  res.send('EVA API is working!');
});

