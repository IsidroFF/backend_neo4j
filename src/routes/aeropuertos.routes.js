const express = require('express');
const router = express.Router();

const { obtenerAeropuertosMedianos, reasignarAeropuerto } = require('../controllers/aeropuertos.controllers.js');

router.get('/med', obtenerAeropuertosMedianos)
router.delete('/reasignar', reasignarAeropuerto)

module.exports = router 