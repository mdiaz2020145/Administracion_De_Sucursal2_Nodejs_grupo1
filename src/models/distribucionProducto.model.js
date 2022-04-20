const mongoose = require('mongoose')
const Schema=mongoose.Schema

const distribucionProductoSchema = Schema({
    nombreEmpresa: String,
    productos:[{
        nombreProducto: String,
        cantidadProducto: Number,
        cantidadVendida:Number  
    }]
})

module.exports = mongoose.model('DistribucionProducto', distribucionProductoSchema);