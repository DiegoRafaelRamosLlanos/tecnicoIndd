import express from 'express';
import { getAlldatos, registrarUsuario, actualizarUsuario, borrarUsuario } from '../controllers/crudController.js';

const router = express.Router();


router.get('/datos', getAlldatos);                
router.post('/registrarUsuario', registrarUsuario); 
router.put('/actualizarUsuario/:idUsuario', actualizarUsuario); 
router.delete('/borrarUsuario/:idUsuario', borrarUsuario);

export default router;