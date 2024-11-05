const express = require('express');
const router = express.Router();

const { certificados } = require('../controllers/empleados.controllers');

router.get('/certificados', certificados);

module.exports = router 