import express from 'express';
import { login, registro, obtenerUsuarios, eliminarUsuario } from '../controllers/user.controller.js';

const router = express.Router();

router.post('/login', login);
router.post('/registro', registro);
router.get('/usuarios', obtenerUsuarios);
router.delete('/eliminar/:id', eliminarUsuario); 

export default router;  




