const express = require('express');
const router = express.Router();

const { autonomiaAvionres } = require('../controllers/aviones.controllers.js');

router.get('/autonomia', autonomiaAvionres)

module.exports = router 