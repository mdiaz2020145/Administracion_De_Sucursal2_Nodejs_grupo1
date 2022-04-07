const mongoose = require('mongoose')
const Schema=mongoose.Schema

const empresaSchema = Schema({
    usuario: String,
    nombreEmpresa: String,
    password: String,
    rol: String,
    tipoEmpresa: String
})

module.exports = mongoose.model('Empresas', empresaSchema);