const express = require('express');
const sucursalesController = require('../controllers/sucursales.controller');
const md_autenticacion = require('../middlewares/autenticacion');
const md_rol= require('../middlewares/roles')
const api = express.Router();

api.post('/agregarSucursal', [md_autenticacion.Auth,md_rol.verEmpresa], sucursalesController.agregarSucursal);
api.put('/editarSucursal/:idSucursal', [md_autenticacion.Auth,md_rol.verEmpresa], sucursalesController.editarSucursal);
api.delete('/eliminarSucursal/:idSucursal', [md_autenticacion.Auth,md_rol.verEmpresa], sucursalesController.eliminarSucursal);
api.get('/obtenerSucursalId/:idSucursal', [md_autenticacion.Auth,md_rol.verEmpresa], sucursalesController.obtenerSucursalId);
api.get('/obtenerSucursales', [md_autenticacion.Auth,md_rol.verEmpresa], sucursalesController.obtenerSucursales);
api.get('/obtenerSucursalesPorEmpresa/:idEmpresa', md_autenticacion.Auth, sucursalesController.obtenerSucursalesEmpresa);

module.exports = api;