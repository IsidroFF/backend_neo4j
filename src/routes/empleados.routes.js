const express = require('express');
const router = express.Router();

const { certificados, eliminarRutasPilotos } = require('../controllers/empleados.controllers');

router.get('/certificados', certificados);
router.delete('/pilotos/rutas', eliminarRutasPilotos);

module.exports = router 