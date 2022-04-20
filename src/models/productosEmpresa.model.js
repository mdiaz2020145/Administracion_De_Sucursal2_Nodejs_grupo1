const mongoose = require('mongoose')
const Schema=mongoose.Schema

const productosEmpresaSchema = Schema({
    idEmpresa: { type: Schema.Types.ObjectId, ref: 'Empresas' },
    nombreProducto: String,
    nombreProveedor: String,
    cantidad: Number,
    vendido: Number,
    precio: Number,
    
})

module.exports = mongoose.model('productosEmpresa', productosEmpresaSchema);