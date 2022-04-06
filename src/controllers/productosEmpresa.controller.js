const ProductosEmpresa = require('../models/productosEmpresa.model')
const Empresa = require('../models/empresas.model')
const underscore = require('underscore')

function AgregarProductoEmpresa(req, res) {
    var parametros = req.body;
    var productoEmpresaModelo = new ProductosEmpresa();
    if (parametros.nombreProducto && parametros.cantidad && parametros.nombreProveedor && parametros.precio
        && parametros.nombreEmpresa) {

        ProductosEmpresa.findOne({ nombreProducto: parametros.nombreProducto }, (err, productoEncontrado) => {
            if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
            if (underscore.isEmpty(productoEncontrado)) {
                productoEmpresaModelo.nombreProducto = parametros.nombreProducto;
                productoEmpresaModelo.nombreProveedor = parametros.nombreProveedor;
                productoEmpresaModelo.cantidad = parametros.cantidad;
                productoEmpresaModelo.precio = parametros.precio;
                productoEmpresaModelo.vendido = 0;
                Empresa.findOne({ nombreEmpresa: parametros.nombreEmpresa }, (err, empresanEncontrada) => {
                    if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
                    if (!underscore.isEmpty(empresanEncontrada)) {
                        productoEmpresaModelo.nombreEmpresa = parametros.nombreEmpresa;

                        productoEmpresaModelo.save((err, productoGuardado) => {
                            if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
                            if (!productoGuardado) return res.status(404).send({ mensaje: "Error, no se agrego ninguna empresa" });

                            return res.status(200).send({ productoEmpresa: productoGuardado });
                        })
                    } else {
                        return res.status(404).send({ mensaje: "La empresa a ingresa no existe" });
                    }
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
        ProductosEmpresa.findByIdAndUpdate(idProducto, parametros, { new: true }, (err, productoActualizado) => {
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

    ProductosEmpresa.findByIdAndDelete(idProducto, (err, productoEliminado) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if (!productoEliminado) return res.status(404).send({ mensaje: 'Error al eliminar la empresa' });

        return res.status(200).send({ productoEmpresa: productoEliminado });
    })
}

module.exports = {
    AgregarProductoEmpresa,
    EditarProductoEmpresa,
    EliminarEmpresa
}