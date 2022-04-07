const express = require('express');
const empresaController = require('../controllers/empresas.controller');
const md_autenticacion = require('../middlewares/autenticacion');
const api = express.Router();

api.post('/registrar', empresaController.registrar);
api.post('/login', empresaController.login);
api.post('/agregarE', md_autenticacion.Auth, empresaController.AgregarEmpresa);
api.put('/editarE/:idEmpresa', md_autenticacion.Auth, empresaController.EditarEmpresa);
api.delete('/eliminarE/:idEmpresa',md_autenticacion.Auth, empresaController.EliminarEmpresa);
api.get('/encontrarE', md_autenticacion.Auth, empresaController.BuscarEmpresa);
api.get('/encontrarEId/:idEmpresa', md_autenticacion.Auth, empresaController.BuscarEmpresaId);
module.exports = api;