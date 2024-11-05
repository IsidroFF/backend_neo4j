const express = require('express');
const router = express.Router();

const { 
    paisesSinOperacionEI, 
    empresasEnAeropuertos, 
    eliminarEmpresaAeropuerto, 
    emmpleadosEmpresa, 
    eliminarPilotos 
} = require('../controllers/empresas.controllers.js');

router.get('/int/nopaises', paisesSinOperacionEI);
router.get('/aeropuertos', empresasEnAeropuertos);
router.delete('/aeropuertos', eliminarEmpresaAeropuerto);
router.get('/empleados', emmpleadosEmpresa);
router.delete('/empleados/pilotos', eliminarPilotos);

module.exports = router 