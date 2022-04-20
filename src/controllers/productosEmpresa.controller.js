const Productos = require('../models/productosEmpresa.model')
const Empresa = require('../models/empresas.model')
const Sucursales = require('../models/sucursales.model')
const underscore = require('underscore')
const DistribucionProducto = require('../models/distribucionProducto.model')

function AgregarProductoEmpresa(req, res) {
    var parametros = req.body;
    var productoEmpresaModelo = new Productos();
    if (parametros.nombreProducto && parametros.cantidad && parametros.nombreProveedor && parametros.precio) {

        Productos.findOne({ nombreProducto: parametros.nombreProducto }, (err, productoEncontrado) => {
            if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
            if (underscore.isEmpty(productoEncontrado)) {
                productoEmpresaModelo.nombreProducto = parametros.nombreProducto;
                productoEmpresaModelo.nombreProveedor = parametros.nombreProveedor;
                productoEmpresaModelo.cantidad = parametros.cantidad;
                productoEmpresaModelo.precio = parametros.precio;
                productoEmpresaModelo.vendido = 0;
                Empresa.findOne({ nombreEmpresa: parametros.nombreEmpresa }, (err, empresanEncontrada) => {
                    if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
                    

                        productoEmpresaModelo.save((err, productoGuardado) => {
                            if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
                            if (!productoGuardado) return res.status(404).send({ mensaje: "Error, no se agrego ninguna empresa" });

                            return res.status(200).send({ productoEmpresa: productoGuardado });
                        })
                })
            } else {
                return res.status(200).send({ mesaje: "Este producto ya existe" })
            }
        })

    } else {
        return res.status(404).send({ empresa: "No has llenado todos los campos." })
    }
}

function EditarProductoEmpresa(req, res) {
    var idProducto = req.params.idProductoEmpresa;
    var parametros = req.body;
    if (!underscore.isEmpty(parametros)) {
        Productos.findByIdAndUpdate(idProducto, parametros, { new: true }, (err, productoActualizado) => {
            if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
            if (!productoActualizado) return res.status(404).send({ mensaje: 'Error al editar la empresa' });

            return res.status(200).send({ productoEmpresa: productoActualizado });
        });

    } else {
        return res.status(404).send({ mensaje: 'Datos vacios ingresados' })
    }

}

function EliminarEmpresa(req, res) {
    var idProducto = req.params.idProductoEmpresa;

    Productos.findByIdAndDelete(idProducto, (err, productoEliminado) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if (!productoEliminado) return res.status(404).send({ mensaje: 'Error al eliminar la empresa' });

        return res.status(200).send({ productoEmpresa: productoEliminado });
    })
}

// envio los productos a sucursales
function envioProductos(req,res){
    var parametros = req.body; 
    var DistribucionProducto = new DistribucionProducto();

    if(parametros.nombreProducto,parametros.cantidadProducto){
        DistribucionProducto.idEmpresa = req.user.sub; 
        DistribucionProducto.idSucursal = req.user.sub; 
        DistribucionProducto.nombreProducto = parametros.nombreProducto;
        DistribucionProducto.cantidadProducto = parametros.cantidadProducto;

        DistribucionProducto.save((err,envioProducto)=>{
            if(err) return res.status(500).send({ mensaje: "Error en la peticion" });
            if(!envioProducto) return res.status(404).send( { mensaje: "Error, no se envio Producto"});
            return res.status(200).send({ Productos: envioProducto });
        })
    }

}

module.exports = {
    AgregarProductoEmpresa,
    EditarProductoEmpresa,
    EliminarEmpresa,
    envioProductos
}