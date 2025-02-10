import express from 'express';
import { getPreheviasData } from '../controllers/preheviasController.js';

const router = express.Router();

router.get('/datos', getPreheviasData); // Ruta para obtener datos de prehevias

export default router;
