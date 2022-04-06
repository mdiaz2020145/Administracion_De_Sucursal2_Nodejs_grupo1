const mongoose = require('mongoose')
const Schema=mongoose.Schema

const productosEmpresaSchema = Schema({
    nombreProducto: String,
    nombreProveedor: String,
    cantidad: Number,
    vendido: Number,
    precio: Number,
    nombreEmpresa: String
})

module.exports = mongoose.model('productosEmpresa', productosEmpresaSchema);