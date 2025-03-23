import express from 'express';
import { getAlldatos, registrarUsuario, actualizarUsuario, borrarUsuario, getSecondSheetData, addOrUpdateSecondSheetData, updateSecondSheetData } from '../controllers/crudController.js';

const router = express.Router();

router.get('/datos', getAlldatos);                
router.post('/registrarUsuario', registrarUsuario); 
router.put('/actualizarUsuario/:idUsuario', actualizarUsuario); 
router.delete('/borrarUsuario/:idUsuario', borrarUsuario);

router.get('/secondSheetData', getSecondSheetData); 
router.post('/addOrUpdateSecondSheetData', addOrUpdateSecondSheetData); 
router.put('/updateSecondSheetData', updateSecondSheetData);

export default router;