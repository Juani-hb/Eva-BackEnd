import express from "express";
import cors from "cors";
import db from './db.js';
import userRoutes from './routes/user.router.js';
import video from './routes/videos.router.js';

const app = express();
const port = 3000;

app.use(cors());

app.use('/user', express.json(), userRoutes);

app.use('/video', video);

app.listen(port, () => {
  console.log(`EVA is listening at http://localhost:${port}`);
});

app.get('/', (req, res) => {
  res.send('EVA API is working!');
});

