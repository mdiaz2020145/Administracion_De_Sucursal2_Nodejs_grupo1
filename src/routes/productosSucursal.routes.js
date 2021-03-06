const express = require('express');
const productoSucursalController = require('../controllers/productosSucursales.controller');
const md_autenticacion = require('../middlewares/autenticacion');
const md_rol= require('../middlewares/roles');
const api = express.Router();

api.get('/obtenerProductosSucursal/:idSucursal',[md_autenticacion.Auth,md_rol.verEmpresa],productoSucursalController.obtenerProductoSucursal)
api.put('/simularVenta/:idSucursal', [md_autenticacion.Auth,md_rol.verEmpresa],productoSucursalController.simularVenta)
api.get('/obtenerProductoSucursalNombre/:idSucursal/:nombreProducto',[md_autenticacion.Auth,md_rol.verEmpresa],productoSucursalController.BuscarProductoSucursalNombre)

module.exports = api;