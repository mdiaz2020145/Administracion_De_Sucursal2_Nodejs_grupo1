const mongoose = require('mongoose')
const Schema=mongoose.Schema

const usuariosSchema = Schema({
    usuario: String,
    nombreEmpresa: String,
    password: String,
    rol: String,
    tipoEmpresa: String
})

module.exports = mongoose.model('usuarios', usuariosSchema);