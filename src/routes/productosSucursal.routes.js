const express = require('express');
const productoSucursalController = require('../controllers/productosSucursales.controller');
const md_autenticacion = require('../middlewares/autenticacion');
const md_rol= require('../middlewares/roles');
const api = express.Router();

api.get('/obtenerProductosSucursal/:idSucursal',[md_autenticacion.Auth,md_rol.verEmpresa],productoSucursalController.obtenerProductoSucursal)
module.exports = api;