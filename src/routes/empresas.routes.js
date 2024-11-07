const express = require('express');
const router = express.Router();

const { 
    paisesSinOperacionEI, 
    empresasEnAeropuertos, 
    eliminarEmpresaAeropuerto, 
    emmpleadosEmpresa, 
    eliminarPilotos, 
    reasignarEmpresa,
    eliminarAviones
} = require('../controllers/empresas.controllers.js');

router.get('/int/nopaises', paisesSinOperacionEI);
router.get('/aeropuertos', empresasEnAeropuertos);
router.get('/empleados', emmpleadosEmpresa);

router.delete('/aeropuertos', eliminarEmpresaAeropuerto);
router.delete('/empleados/pilotos', eliminarPilotos);
router.delete('/reasignar', reasignarEmpresa);
router.delete('/aviones', eliminarAviones);

module.exports = router 