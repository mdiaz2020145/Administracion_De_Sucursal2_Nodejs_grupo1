const Empresa=require('../models/empresas.model')
const underscore=require('underscore');
const bcrypt=require('bcrypt-nodejs');
const jwt=require('jwt-simple')

function registrar(req, res){
    var parametros=req.body;
    var empresaModel=new Empresa;
    Empresa.findOne({usuario: parametros.usuario}, (err, empresaEncontrada)=>{
        if(underscore.isEmpty(empresaEncontrada)){
            empresaModel.usuario=parametros.usuario;
            empresaModel.nombreEmpresa=parametros.nombre;
            empresaModel.rol='EMPRESA';
            empresaModel.tipoEmpresa=parametros.tipoEmpresa;
            bcrypt.hash(parametros.password,null,null, (err,passwordEncriptada)=>{
                empresaModel.password=passwordEncriptada
                empresaModel.save(()=>{});
            })
        }else{
            return res.status(500).send({mensaje: "El nombre de usuario ya esta en uso, utilice uno diferente"})
        }
    })
}



function creacionAdmin() {
    var empresaModel = new Empresa();
    Empresa.findOne({ usuario: 'SuperAdmin' }, (err, usuarioEncontrado) => {

        if (underscore.isEmpty(usuarioEncontrado)) {

            empresaModel.usuario = 'SuperAdmin';
            empresaModel.nombre = 'Administrador por Defecto';
            empresaModel.rol = 'ADMIN';

            bcrypt.hash('123456', null, null, (err, passwordEncriptada) => {
                empresaModel.password = passwordEncriptada;

                empresaModel.save(() => {
                    console.log("Administrador creado con exito")
                });

            });
        } else {
            console.log("El administrador ya existe")
        }
    })
}

function login(req, res) {
    var parametros = req.body;
    Empresa.findOne({ usuario: parametros.usuario }, (err, empresaEncontrada) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if (underscore.isEmpty(empresaEncontrada)) {
            bcrypt.compare(parametros.password, empresaEncontrada.password,
                (err, verificacionPassword) => {
                    if (verificacionPassword) {
                        if (parametros.obtenerToken === 'true') {
                            return res.status(200)
                                .send({ token: jwt.crearToken(empresaEncontrada) })
                        } else {
                            empresaEncontrada.password = undefined;
                            return res.status(200)
                                .send({ empresa: "Parametro faltante" })
                        }

                    } else {
                        return res.status(500)
                            .send({ mensaje: 'La clave no coincide' });
                    }
                })
        } else {
            return res.status(500)
                .send({ mensaje: 'Error, la empresa no se encuentra registrada.' })
        }
    })
}

function AgregarEmpresa (req, res){
    var parametros = req.body;
    var empresaModelo = new Empresa();

    if( parametros.usuario && parametros.nombreEmpresa && parametros.password && parametros.tipoEmpresa) {
        empresaModelo.email = parametros.email;
        empresaModelo.password = parametros.password;
        empresaModelo.rol = 'EMPRESA';
        empresaModelo.tipoEmpresa = parametros.tipoEmpresa;

        bcrypt.hash(parametros.password, null, null, (err, passwordEncriptada) => {
            empresaModelo.password = passwordEncriptada;

                 empresaModelo.save((err, empresaGuardada) => {
                       if(err) return res.status(500).send({ mensaje: "Error en la peticion" });
                       if(!empresaGuardada) return res.status(404).send( { mensaje: "Error, no se agrego ninguna empresa"});

                 return res.status(200).send({ empresa: empresaGuardada });
        })
      })
    }
}

function EditarEmpresa (req, res) {
    var idE = req.params.idEmpresa;
    var parametros = req.body;
    
        Empresa.findByIdAndUpdate(idE, parametros, { new: true } ,(err, empresaActualizada) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion'});
        if(!empresaActualizada) return res.status(404).send( { mensaje: 'Error al editar la empresa'});

        return res.status(200).send({ empresa: empresaActualizada});
    });
}

function EliminarEmpresa(req, res){
    var id = req.params.idEmpresa;
    
    Empresa.findByIdAndDelete(id, (err, empresaEliminada) => {
        if(err) return res.status(500).send({ mensaje: 'Error en la peticion'});
        if(!empresaEliminada) return res.status(404).send( { mensaje: 'Error al eliminar la empresa'});

        return res.status(200).send({ empresa: empresaEliminada});
    })
}

function BuscarEmpresa(req, res){
    Empresa.find((err, empresaEncontrada) => {
        if (err) return res.send({ mensaje: "Error: " + err })

        for (let i = 0; i < empresaEncontrada.length; i++) {
            console.log(empresaEncontrada[i].nombre)
        }

        return res.send({ empresa: empresaEncontrada });
    })
}


module.exports ={
    creacionAdmin,
    registrar,
    login,
    AgregarEmpresa,
    EditarEmpresa,
    EliminarEmpresa,
    BuscarEmpresa
}