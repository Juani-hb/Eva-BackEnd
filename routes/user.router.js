import express from 'express';
import { login } from '../controllers/user.controller.js';

const router = express.Router();

router.post('/login', login);

export default router;

import { registro } from '../controllers/userController.js';



router.post('/registro', registro);

