const express = require("express");
const bodyParser = require('body-parser');
const app = express();
const logger = require('./cache/logger');

// Rutas
const AeropuertosRouter = require('./routes/aeropuertos.routes.js');
const EmpresaRouter = require('./routes/empresas.routes.js');
const AvionesRouter = require('./routes/aviones.routes.js');
const EmpleadosRouter = require('./routes/empleados.routes.js')

//middlewares
app.use(logger)
app.use(bodyParser.urlencoded({extended: true }));
app.use(bodyParser.json());

// Permitir JSON en las peticiones
app.use(express.json());

// Rutas de NEO4J
app.use('/aeropuertos', AeropuertosRouter);
app.use('/empresas', EmpresaRouter);
app.use('/aviones', AvionesRouter);
app.use('/empleados', EmpleadosRouter);

// Exportamos la aplicacion de express creada
module.exports = app