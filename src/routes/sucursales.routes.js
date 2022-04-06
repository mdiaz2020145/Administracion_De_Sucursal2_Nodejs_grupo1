const express = require('express');
const sucursalesController = require('../controllers/sucursales.controller');
const md_autenticacion = require('../middlewares/autenticacion');
const api = express.Router();

api.post('/agregarSucursal', md_autenticacion.Auth, sucursalesController.agregarSucursal);
api.put('/editarSucursal/:idSucursal', md_autenticacion.Auth, sucursalesController.editarSucursal);
api.delete('/eliminarSucursal/:idSucursal', md_autenticacion.Auth, sucursalesController.eliminarSucursal);
api.get('/obtenerSucursalId/:idSucursal', md_autenticacion.Auth, sucursalesController.obtenerSucursalId);
api.get('/obtenerSucursales', md_autenticacion.Auth, sucursalesController.obtenerSucursales);

module.exports = api;