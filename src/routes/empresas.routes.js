const express = require('express');
const empresaController = require('../controllers/empresas.controller');
const md_autenticacion = require('../middlewares/autenticacion');
const md_rol= require('../middlewares/roles')
const api = express.Router();

api.post('/registrar', empresaController.registrar);
api.post('/login', empresaController.login);
api.post('/agregarE', [md_autenticacion.Auth,md_rol.verAdministrador], empresaController.AgregarEmpresa);
api.put('/editarE/:idEmpresa', [md_autenticacion.Auth,md_rol.verAdministrador], empresaController.EditarEmpresa);
api.delete('/eliminarE/:idEmpresa',[md_autenticacion.Auth,md_rol.verAdministrador], empresaController.EliminarEmpresa);
api.get('/encontrarE', [md_autenticacion.Auth,md_rol.verAdministrador], empresaController.BuscarEmpresa);
api.get('/encontrarEId/:idEmpresa', [md_autenticacion.Auth,md_rol.verAdministrador], empresaController.BuscarEmpresaId);
module.exports = api;