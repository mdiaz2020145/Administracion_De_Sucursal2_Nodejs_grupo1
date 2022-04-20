const mongoose = require('mongoose')
const Schema=mongoose.Schema

const productosEmpresaSchema = Schema({
    nombreProducto: String,
    nombreProveedor: String,
    cantidad: Number,
    precio: Number,
    idEmpresa: { type: Schema.Types.ObjectId, ref: 'Empresas' }
})

module.exports = mongoose.model('productosEmpresa', productosEmpresaSchema);