import express from "express";
import cors from "cors";
import db from './db.js';
import userRoutes from './routes/user.router.js';

const app = express();
const port = 3000;

app.use(cors());
app.use(cors());
app.use(express.json());

app.use('/user', userRoutes); 

app.listen(port, () => {
    console.log(`EVA is listening at http://localhost:${port}`);
});

