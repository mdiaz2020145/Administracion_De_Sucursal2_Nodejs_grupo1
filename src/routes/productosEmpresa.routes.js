const express = require('express');
const productoEmpresaController = require('../controllers/productosEmpresa.controller');
const md_autenticacion = require('../middlewares/autenticacion');
const md_rol= require('../middlewares/roles');
const api = express.Router();

api.post('/agregarProductos',[md_autenticacion.Auth,md_rol.verEmpresa],productoEmpresaController.AgregarProductoEmpresa)
api.put('/editarProductos/:idProductoEmpresa',[md_autenticacion.Auth,md_rol.verEmpresa], productoEmpresaController.EditarProductoEmpresa)
api.delete('/eliminarProductos/:idProductoEmpresa',[md_autenticacion.Auth,md_rol.verEmpresa], productoEmpresaController.EliminarEmpresa)
api.post('/envioProductos',[md_autenticacion.Auth,md_rol.verEmpresa],productoEmpresaController.envioProductos)
api.get('/obtenerProductoEmpresa',[md_autenticacion.Auth,md_rol.verEmpresa],productoEmpresaController.obtenerProductoEmpresa)
module.exports = api;
