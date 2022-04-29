const ProductoEmpresa = require('../models/productosEmpresa.model')
const DistribucionProducto = require('../models/distribucionProducto.model')
const underscore = require('underscore')

function obtenerProductoSucursal(req, res) {
    var idSucursal=req.params.idSucursal;
    DistribucionProducto.find({idSucursal: idSucursal},(err,productosSucursales) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if (!productosSucursales) return res.status(404).send({ mensaje: 'Error al obtener los datos' });

        return res.status(200).send({ ProductosSucursal: productosSucursales });
    }).populate('idSucursal', 'nombreSucursal ubicacion')
}

function simularVenta(req, res) {
    var idSucursal=req.params.idSucursal;
    var parametros=req.body;
    DistribucionProducto.findOne({nombreProducto:{$regex: parametros.nombreProducto, $options: 'i'}, idSucursal: idSucursal},(err,productoSucursal)=>{
        if(err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if(!underscore.isEmpty(productoSucursal)){
            if(productoSucursal.cantidadProducto>=parametros.cantidadProducto){
                let cantidadRestante=parseInt(productoSucursal.cantidadProducto)-parseInt(parametros.cantidadProducto);
                let vendido=parseInt(productoSucursal.vendido)+parseInt(parametros.cantidadProducto);
                DistribucionProducto.findByIdAndUpdate(productoSucursal._id, { cantidadProducto: cantidadRestante, vendido: vendido}, {new: true }, 
                    (err, productoSucursalActualizado) => {
                        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
                        if (!productoSucursalActualizado) return res.status(500).send({ mensaje: 'Error al actualizar los datos' });
                
                        return res.status(200).send({ venta: productoSucursalActualizado });
                })
            }else{
                return res.status(500).send({ mensaje: "La cantidad que desea vender supera las existencias"})
            }
        }else{
            return res.status(500).send({ mensaje: "El producto no se encuentra en esta sucursal"})
        }
    })
}

//Obtener por nombre
function BuscarProductoSucursalNombre(req,res){
    var idSucursal=req.params.idSucursal;
    var nombreProducto=req.params.nombreProducto;

    DistribucionProducto.findOne({nombreProducto:{$regex: nombreProducto, $options: 'i'}, idSucursal: idSucursal},(err,productoEncontrado)=>{
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if (!productoEncontrado) return res.status(404).send({ mensaje: 'Error al obtener los datos, no se encontro nada' });
        return res.status(200).send({ Producto: productoEncontrado });
    })
}

module.exports={
    obtenerProductoSucursal,
    simularVenta,
    BuscarProductoSucursalNombre
}