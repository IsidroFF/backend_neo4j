const express = require('express');
const router = express.Router();

const { obtenerAeropuertosMedianos } = require('../controllers/aeropuertos.controllers.js');

router.get('/med', obtenerAeropuertosMedianos)

module.exports = router 