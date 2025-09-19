import express from "express";
import cors from "cors";
import db from "./db.js";
import userRoutes from "./routes/user.router.js";
import imagenRouter from "./routes/imagen.router.js"; 

const app = express();
const port = 3000;

app.use(cors());


app.use('/user', express.json(), userRoutes);


app.use('/deteccion', imagenRouter);


app.get('/', (req, res) => {
  res.send('EVA API is working!');
});

app.listen(port, () => {
  console.log(`EVA is listening at http://localhost:${port}`);
});
