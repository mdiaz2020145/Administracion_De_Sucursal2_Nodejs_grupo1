const mongoose = require('mongoose')
const Schema=mongoose.Schema

const sucursalesSchema = Schema({
    idEmpresa: { type: Schema.Types.ObjectId, ref: 'Empresas' },
    nombreSucursal: String,
    ubicacion: String,  
    productos:[{
        nombreProducto: String,
        cantidadProducto:Number,
        vendidoProducto: Number
    }]
})

module.exports = mongoose.model('sucursales', sucursalesSchema);