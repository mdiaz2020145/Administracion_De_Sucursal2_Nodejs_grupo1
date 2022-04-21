const DistribucionProducto = require('../models/distribucionProducto.model')

function obtenerProductoSucursal(req, res) {
    var idSucursal=req.params.idSucursal;
    DistribucionProducto.find({idSucursal: idSucursal},(err,productosSucursales) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if (!productosSucursales) return res.status(404).send({ mensaje: 'Error al obtener los datos' });

        return res.status(200).send({ ProductosSucursal: productosSucursales });
    }).populate('idSucursal', 'nombreSucursal ubicacion')
}

module.exports={
    obtenerProductoSucursal
}