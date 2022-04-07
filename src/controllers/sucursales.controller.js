const Sucursal = require('../models/sucursales.model');
const jwt=require('../services/jwt');

function agregarSucursal(req, res){
    var parametros = req.body;
    var sucursalModel = new Sucursal;
    
    if(parametros.nombreSucursal && parametros.ubicacion){
       sucursalModel.idEmpresa = req.user.sub;
       sucursalModel.nombreSucursal = parametros.nombreSucursal;
       sucursalModel.ubicacion = parametros.ubicacion

       sucursalModel.save((err, sucursalGuardada) => {
        if(err) return res.status(500).send({ mensaje: "Error en la peticion" });
        if(!sucursalGuardada) return res.status(404).send( { mensaje: "Error, no se agrego ninguna sucursal"});

       return res.status(200).send({ sucursal: sucursalGuardada });
    })
 }  
}

function editarSucursal(req, res){
    var idSucur = req.params.idSucursal;
    var parametros = req.body;    

     Sucursal.findOneAndUpdate({_id : idSucur, idEmpresa : req.user.sub}, parametros, {new : true}, (err, sucursalActualizada)=>{
            if(err) return res.status(500)
                .send({ mensaje: 'Error en la peticion' });
            if(!sucursalActualizada) return res.status(500)
                .send({ mensaje: 'No puede editar sucursales de otra empresa'});
            
            return res.status(200).send({ sucursal : sucursalActualizada })
        });
}

function eliminarSucursal(req, res){
    var idSucur = req.params.idSucursal;

     Sucursal.findOneAndDelete({_id : idSucur, idEmpresa : req.user.sub}, (err, sucursalEliminada) => {
        if(err) return res.status(500).send({ mensaje: 'Error en la peticion'});
        if(!sucursalEliminada) return res.status(404).send( { mensaje: 'No puede eliminar sucursales de otra empresa'});

        return res.status(200).send({ sucursal: sucursalEliminada});
    })
}

function obtenerSucursalId(req, res){
    var idSucur = req.params.idSucursal;
 
    Sucursal.findOne({_id : idSucur, idEmpresa : req.user.sub}, (err, sucursalObtenida) => {
        if(err) return res.status(500).send({ mensaje: "Error en la peticion" });
        if(!sucursalObtenida) return res.status(500).send({ mensaje: "No puede visualizar sucursales de otra empresa"});

        return res.status(200).send({ sucursal: sucursalObtenida });
    })
}

function obtenerSucursales (req, res) {
    if(req.user.rol=='EMPRESA'){
        Sucursal.find({idEmpresa : req.user.sub}, (err, sucursalesObtenidas) => {
            if (err) return res.send({ mensaje: "Error: " + err })
    
            for (let i = 0; i < sucursalesObtenidas.length; i++) {
                console.log(sucursalesObtenidas[i].nombreSucursal)
            }
    
            return res.send({ Sucursales: sucursalesObtenidas })
        }) 
    }else{
        return res.status(200).send({ Sucursales: 0 })
    }
}

module.exports = {
    agregarSucursal,
    editarSucursal,
    eliminarSucursal,
    obtenerSucursalId,
    obtenerSucursales
}