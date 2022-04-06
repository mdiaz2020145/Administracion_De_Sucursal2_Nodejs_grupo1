const express = require('express');
const empresaController = require('../controllers/empresas.controller');
//const md_autenticacion = require('../middlewares/autenticacion');
const api = express.Router();

api.post('/registrar', empresaController.registrar);
api.post('/login', empresaController.login);
api.post('/agregarE', empresaController.AgregarEmpresa);
api.put('/editarE/:idEmpresa', empresaController.EditarEmpresa);
api.delete('/eliminarE/:idEmpresa', empresaController.EliminarEmpresa);
api.get('/encontrarE', empresaController.BuscarEmpresa);
api.get('/encontrarEId/:idEmpresa', empresaController.BuscarEmpresaId);
module.exports = api;