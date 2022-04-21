const mongoose = require('mongoose')
const Schema=mongoose.Schema

const distribucionProductoSchema = Schema({
    nombreProducto: String,
    cantidadProducto: Number,
    vendido: Number,
    precio: Number,
    idSucursal:{type:Schema.Types.ObjectId,ref:'sucursales'}

})

module.exports = mongoose.model('DistribucionProducto', distribucionProductoSchema);