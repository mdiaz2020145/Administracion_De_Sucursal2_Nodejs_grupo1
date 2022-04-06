const express = require('express');
const productoEmpresaController = require('../controllers/productosEmpresa.controller');
const md_autenticacion = require('../middlewares/autenticacion');
const api = express.Router();

api.post('/agregarProductos',md_autenticacion.Auth,productoEmpresaController.AgregarProductoEmpresa)
api.put('/editarProductos/:idProductoEmpresa',md_autenticacion.Auth, productoEmpresaController.EditarProductoEmpresa)
api.delete('/eliminarProductos/:idProductoEmpresa',md_autenticacion.Auth, productoEmpresaController.EliminarEmpresa)


module.exports = api;