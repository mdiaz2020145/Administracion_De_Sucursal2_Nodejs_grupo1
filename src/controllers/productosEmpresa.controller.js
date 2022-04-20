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
                productoEmpresaModelo.idEmpresa= req.user.sub;
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
function envioProductos(req, res) {
    var parametros = req.body;
    var distribucionProducto = new DistribucionProducto();
    if (parametros.nombreProducto, parametros.cantidadProducto, parametros.sucursal) {

        //SE BUSCA LA SUCURSAL EN LA QUE SE QUIERE ENVIAR LOS PRODUCTOS
        Sucursales.findOne({ nombreSucursal: { $regex: parametros.sucursal, $options: 'i' } }, (err, sucursalEncontrada) => {
            if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
            if (!underscore.isEmpty(sucursalEncontrada)) {

                //SI LA SUCURSAL EXISTE SE ASIGNA SU ID AL PRODUCTO
                Productos.findOne({idEmpresa: req.user.sub, nombreProducto: { $regex: parametros.nombreProducto, $options: 'i' }}, (err, productoEmpresaEncontrado) => {//SE BUSCA EL PRODUCTO QUE SE DESEA ENVIAR
                    if (err) return res.status(500).send({ mensaje: "Error en la peticion" })

                    if (!underscore.isEmpty(productoEmpresaEncontrado)) {//SI EL PRODUCTO A ENVIAR EXISTE EN BODEGA SE ENVIARA

                        if (productoEmpresaEncontrado.cantidad >= parametros.cantidadProducto) {//SI LA CANTIDAD TOTAL DEL PRODUCTO ES MAYOR A LA QUE SE DESEA ENVIAR LO ENVIARA

                            //SE BUSCA SI EL PRODUCTO YA EXISTE EN LA SUCURSAL
                            DistribucionProducto.findOne({ nombreProducto: parametros.nombreProducto, idSucursal: sucursalEncontrada._id }, (err, productoSucursalEncontrado) => {
                                if (err) return res.status(500).send({ mensaje: "Error en la peticion" });

                                if (underscore.isEmpty(productoSucursalEncontrado)) {//SI EL PRODUCTO ES NUEVO ENTONCES SE AGREGARA COMO UN DOCUMENTO NUEVO
                                    distribucionProducto.nombreProducto = parametros.nombreProducto;
                                    distribucionProducto.cantidadProducto = parametros.cantidadProducto;
                                    distribucionProducto.idSucursal = sucursalEncontrada._id;
                                    distribucionProducto.idEmpresa = req.user.sub;
                                    distribucionProducto.precio=productoEmpresaEncontrado.precio;
                                    distribucionProducto.vendido = 0;
                                    distribucionProducto.save((err, envioProducto) => {
                                        if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
                                        if (!envioProducto) return res.status(404).send({ mensaje: "Error, no se envio Producto" });
                                        let cantidadTotal = parseInt(productoEmpresaEncontrado.cantidad) - parseInt(parametros.cantidadProducto);
                                        Productos.findByIdAndUpdate(productoEmpresaEncontrado._id, { cantidad: cantidadTotal }, { new: true }, (err, productoSucursalActualizado) => { })
                                        return res.status(200).send({ Productos: envioProducto });
                                    })
                                } else {//SI EL PRODUCTO YA EXISTE EN ESTA SUCURSAL SOLO SE SUMARA SU CANTIDAD A LA EXISTENTE
                                    let cantidadTotal = parseInt(parametros.cantidadProducto) + parseInt(productoSucursalEncontrado.cantidadProducto);
                                    DistribucionProducto.findByIdAndUpdate(productoSucursalEncontrado._id, { cantidadProducto: cantidadTotal }, { new: true }, (err, productoSucursalActualizado) => {
                                        if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
                                        if (!productoSucursalActualizado) return res.status(404).send({ mensaje: "Error, no se envio Producto" });
                                        let cantidadT = parseInt(productoEmpresaEncontrado.cantidad) - parseInt(parametros.cantidadProducto);
                                        Productos.findByIdAndUpdate(productoEmpresaEncontrado._id, { cantidad: cantidadT }, { new: true }, (err, productoSucursalActualizado) => { })
                                        return res.status(200).send({ Productos: productoSucursalActualizado });
                                    })
                                }
                            })
                        } else {//SI LA CANTIDAD A ENVIAR ES MAYOR A LA EXISTENTE EN BODEGA NO DEJARA QUE SE REALICE EL ENVIO
                            return res.status(500).send({ mensaje: "La cantidad de producto en bodega es insuficiente" });
                        }
                    } else {//SI NO EXISTE NO LO DEJARA
                        return res.status(500).send({ mensaje: "El producto que se desea enviar no existe" });
                    }
                })
            } else {
                return res.status(500).send({ mensaje: "La sucursal a la que desea enviar los productos no existe" });
            }
        })
    }else{
        return res.status(500).send({ mensaje: "Llene todos los campos para continuar" });
    }

}

module.exports = {
    AgregarProductoEmpresa,
    EditarProductoEmpresa,
    EliminarEmpresa,
    envioProductos
}