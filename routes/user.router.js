import express from 'express';
import { login, registro, obtenerUsuarios } from '../controllers/user.controller.js';

const router = express.Router();

router.post('/login', login);
router.post('/registro', registro);
router.get('/usuarios', obtenerUsuarios); // ✅ GET agregado

export default router;




