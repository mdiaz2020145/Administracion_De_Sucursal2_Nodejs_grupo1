const Productos = require('../models/productosEmpresa.model')
const Empresa = require('../models/empresas.model')
const underscore = require('underscore')
const Sucursales = require('../models/sucursales.model')

function AgregarProductoEmpresa(req, res) {
    var parametros = req.body;
    var productoEmpresaModelo = new Productos();
    if (parametros.nombreProducto && parametros.cantidad && parametros.nombreProveedor && parametros.precio
        && parametros.idEmpresa) {
        Productos.findOne({ nombreProducto: parametros.nombreProducto }, (err, productoEncontrado) => {
            if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
            if (underscore.isEmpty(productoEncontrado)) {
                Empresa.findById(parametros.idEmpresa, (err, empresanEncontrada) => {
                    if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
                    console.log(empresanEncontrada)
                    console.log(parametros.idEmpresa)
                    productoEmpresaModelo.nombreProducto = parametros.nombreProducto;
                    productoEmpresaModelo.nombreProveedor = parametros.nombreProveedor;
                    productoEmpresaModelo.cantidad = parametros.cantidad;
                    productoEmpresaModelo.precio = parametros.precio;
                    productoEmpresaModelo.vendido = 0;
                    productoEmpresaModelo.idEmpresa = empresanEncontrada._id;
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
    var parametros= req.body
    var ingresoFor = false;
    console.log(req.user.rol)
    if(req.user.rol === 'EMPRESA'){
        if(parametros.nombreSucursal && parametros.ubicacion && parametros.nombreProducto
            && parametros.cantidadProducto){
            
                Productos.findOne({idEmpresa: req.user.sub,nombreProducto: parametros.nombreProducto},(err,productoEncontrado)=>{
                    if (err) return res.status(500).send({ mensaje: 'Error en la peticion'+err });
                    if(underscore.isEmpty(productoEncontrado)) return res.status(404).send({ mensaje: 'Este producto no exite.'});
                    console.log(productoEncontrado)
                    if(productoEncontrado.cantidad < parametros.cantidadProducto){
                        return res.status(200).send({productos: 'La cantidad de productos es mayor. Solo hay '+productoEncontrado.cantidad})
                    }else{

                        Sucursales.findOne({nombreSucursal: parametros.nombreSucursal},(err, sucursalEncontrada)=>{
                            if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
                            if(underscore.isEmpty(sucursalEncontrada)){
                                var modeloSucursales = Sucursales();
                                modeloSucursales.nombreSucursal = parametros.nombreSucursal;
                                modeloSucursales.ubicacion = parametros.ubicacion;
                                modeloSucursales.save((err,sucursalGuardada)=>{
                                    if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
                                    if(underscore.isEmpty(sucursalGuardada)) {
                                        res.status(404).send({sucursales: "Error al momento de guardar la sucursal."})

                                    }else{

                                        /* procedimiento de ingreso producto*/
                                        
                                        Sucursales.findOneAndUpdate({nombreSucursal: parametros.nombreSucursal}, 
                                            { $push: { productos: { nombreProducto: parametros.nombreProducto,
                                            cantidadProducto: parametros.cantidadProducto, cantidadVendida: 0 } } }, {new: true}, (err, productoAgregado) => {
                                                if(err) return res.status(500).send({ mensaje: "Error en la peticion" });
                                                
                                                if(!productoAgregado) return res.status(500).send({ mensaje: 'Error al agregar el producto'});
                                                Productos.findOneAndUpdate({nombreProducto: parametros.nombreProducto},{$inc: {  cantidad: parametros.cantidadProducto * -1, 
                                                    vendido: parametros.cantidadProducto}},{new:true},(err, productoActualizado)=>{
                                                    if(err) return res.status(500).send({ mensaje: "Error en la peticion" }); 
                                                    if(!productoActualizado) return res.status(404).send({ mensaje: "Error al restar productos" });
                                                    return res.status(404).send({productos: productoAgregado})
                                                })   
                                        })
                                    }


                                })
                            }else{
                                
                                for (let i = 0; i < sucursalEncontrada.productos.length; i++) {
                                    if(sucursalEncontrada.productos[i].nombreProducto === parametros.nombreProducto ){
                                        ingresoFor = true;
                                        let cantidadTotal = Number( sucursalEncontrada.productos[i].cantidadProducto) + Number(parametros.cantidadProducto);
                                        Sucursales.findOneAndUpdate({productos:{$elemMatch:{nombreProducto: parametros.nombreProducto}}},
                                            { "productos.$.cantidadProducto": cantidadTotal}, {new: true}, (err, productoAgregado) => {
                                                if(err) return res.status(500).send({ mensaje: "Error en la peticion"+err });
                                                if(underscore.isEmpty(productoAgregado)) return res.status(500).send({ mensaje: 'Error al agregar el producto'});
                                                Productos.findOneAndUpdate({nombreProducto: parametros.nombreProducto},{$inc: {  cantidad: parametros.cantidadProducto * -1, 
                                                    vendido: parametros.cantidadProducto}},{new:true},(err, productoActualizado)=>{
                                                    if(err) return res.status(500).send({ mensaje: "Error en la peticion"+err }); 
                                                    if(!productoActualizado) return res.status(404).send({ mensaje: "Error al restar productos" });
                                                    return res.status(404).send({productos: productoAgregado})
                                                })   
                                        })
                         
                                    }
                                 }
                                 
                            }
                            if(ingresoFor === false){
                                    Sucursales.findOneAndUpdate({nombreSucursal: parametros.nombreSucursal}, 
                                        { $push: { productos: { nombreProducto: parametros.nombreProducto,
                                        cantidadProducto: parametros.cantidadProducto, cantidadVendida: 0 } } }, {new: true}, (err, productoAgregado) => {
                                            if(err) return res.status(500).send({ mensaje: "Error en la peticion" });
                                            
                                            if(!productoAgregado) return res.status(500).send({ mensaje: 'Error al agregar el producto'});
                                            Productos.findOneAndUpdate({nombreProducto: parametros.nombreProducto},{$inc: {  cantidad: parametros.cantidadProducto * -1, 
                                                vendido: parametros.cantidadProducto}},{new:true},(err, productoActualizado)=>{
                                                if(err) return res.status(500).send({ mensaje: "Error en la peticion" }); 
                                                if(!productoActualizado) return res.status(404).send({ mensaje: "Error al restar productos" });
                                                return res.status(404).send({productos: productoAgregado})
                                            })   
                                    })
                                }
                            })
                        
                    }

                })
            
        }else{
            return res.status(200).send({ productos: "No has llenado todos los campos."});
        }
    }else{
        return res.status(200).send({ productos: "No posees los permisos necesarios."});
    }
}

module.exports = {
    AgregarProductoEmpresa,
    EditarProductoEmpresa,
    EliminarEmpresa,
    envioProductos
}