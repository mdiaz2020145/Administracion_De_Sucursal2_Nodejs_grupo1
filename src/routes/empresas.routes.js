const express = require('express');
const empresaController = require('../controllers/empresas.controller');
//const md_autenticacion = require('../middlewares/autenticacion');
const api = express.Router();

api.post('/registrar', empresaController.registrar);
api.post('/login', empresaController.login);
module.exports = api;