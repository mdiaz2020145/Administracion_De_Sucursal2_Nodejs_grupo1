const express=require('express')
const cors=require('cors')
var app = express()

const empresasRutas=require('./src/routes/empresas.routes');
const sucursalesRutas = require('./src/routes/sucursales.routes');
const productosEmpresaRutas = require('./src/routes/productosEmpresa.routes');
const productosSucursalRutas = require('./src/routes/productosSucursal.routes')

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(cors());

app.use('/api', empresasRutas, sucursalesRutas, productosEmpresaRutas, productosSucursalRutas);


module.exports = app;