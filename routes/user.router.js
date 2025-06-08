import express from 'express';
import { login, registro } from '../controllers/user.controller.js';

const router = express.Router();

router.post('/login', login);
router.post('/registro', registro);

export default router;



