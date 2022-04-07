const mongoose = require('mongoose')
const Schema=mongoose.Schema

const sucursalesSchema = Schema({
    idEmpresa: { type: Schema.Types.ObjectId, ref: 'Empresas' },
    nombreSucursal: String,
    ubicacion: String,  
})

module.exports = mongoose.model('sucursales', sucursalesSchema);