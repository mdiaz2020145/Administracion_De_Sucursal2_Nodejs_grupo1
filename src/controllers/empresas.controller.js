const Empresa = require('../models/empresas.model')
const underscore = require('underscore');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt')
const DistribucionProducto = require('../models/distribucionProducto.model')

function registrar(req, res) {
    var parametros = req.body;
    var empresaModel = new Empresa;
    Empresa.findOne({ usuario: parametros.usuario }, (err, empresaEncontrada) => {
        if (underscore.isEmpty(empresaEncontrada)) {
            empresaModel.usuario = parametros.usuario;
            empresaModel.nombreEmpresa = parametros.nombreEmpresa;
            empresaModel.rol = 'EMPRESA';
            empresaModel.tipoEmpresa = parametros.tipoEmpresa;
            bcrypt.hash(parametros.password, null, null, (err, passwordEncriptada) => {
                empresaModel.password = passwordEncriptada
                registroSucursal(parametros);
                empresaModel.save((err, empresaGuardada) => { 
                    return res.status(200).send({ empresa: empresaGuardada })
                });
            })
        } else {
            return res.status(500).send({ mensaje: "El nombre de usuario ya esta en uso, utilice uno diferente" })
        }
    })
}



function creacionAdmin() {
    var empresaModel = new Empresa();
    Empresa.findOne({ usuario: 'SuperAdmin' }, (err, usuarioEncontrado) => {

        if (underscore.isEmpty(usuarioEncontrado)) {

            empresaModel.usuario = 'SuperAdmin';
            empresaModel.nombreEmpresa = 'Administrador por Defecto';
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
        if (empresaEncontrada) {
            bcrypt.compare(parametros.password, empresaEncontrada.password,
                (err, verificacionPassword) => {
                    if (verificacionPassword) {
                        if (parametros.obtenerToken === 'true') {
                            return res.status(200)
                                .send({ token: jwt.crearToken(empresaEncontrada) })
                        } else {
                            empresaEncontrada.password = undefined;
                            return res.status(200)
                                .send({ empresa: empresaEncontrada })
                        }

                    } else {
                        return res.status(500)
                            .send({ mensaje: 'La clave no coincide' });
                    }
                })
        } else {
            return res.status(500)
                .send({ mensaje: 'Error, el usuario no se encuentra registrado.' })
        }
    })
}

function AgregarEmpresa(req, res) {
    var parametros = req.body;
    var empresaModelo = new Empresa();

    if (parametros.usuario && parametros.nombreEmpresa && parametros.password && parametros.tipoEmpresa) {
        empresaModelo.usuario = parametros.usuario;
        empresaModelo.nombreEmpresa = parametros.nombreEmpresa;
        empresaModelo.password = parametros.password;
        empresaModelo.rol = 'EMPRESA';
        empresaModelo.tipoEmpresa = parametros.tipoEmpresa;

        bcrypt.hash(parametros.password, null, null, (err, passwordEncriptada) => {
            empresaModelo.password = passwordEncriptada;
            registroSucursal(parametros);
            empresaModelo.save((err, empresaGuardada) => {
                if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
                if (!empresaGuardada) return res.status(404).send({ mensaje: "Error, no se agrego ninguna empresa" });

                return res.status(200).send({ empresa: empresaGuardada });
            })
        })
    }
}

function registroSucursal(parametros){

    DistribucionProducto.find({nombreEmpresa: parametros.nombreEmpresa},(err,empresaEncontrada)=>{
        if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
        if(underscore.isEmpty(empresaEncontrada)){

            var distribucionModel = DistribucionProducto();
            distribucionModel.nombreEmpresa = parametros.nombreEmpresa;
            distribucionModel.cantidadVendida = 0;
            distribucionModel.save((err,sucursal)=>{
                if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
                if (!sucursal) return res.status(404).send({ mensaje: "Error, no se agrego ninguna sucursal" });
            })
        }
    })
}

function EditarEmpresa(req, res) {
    if (req.user.rol == 'ADMIN') {
        var idE = req.params.idEmpresa;
        var parametros = req.body;

        Empresa.findByIdAndUpdate(idE, parametros, { new: true }, (err, empresaActualizada) => {
            if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
            if (!empresaActualizada) return res.status(404).send({ mensaje: 'Error al editar la empresa' });

            return res.status(200).send({ empresa: empresaActualizada });
        });
    } else {
        return res.status(200).send({ empresa: 0 });
    }
}

function EliminarEmpresa(req, res) {
    if (req.user.rol == 'ADMIN') {
        var id = req.params.idEmpresa;

        Empresa.findByIdAndDelete(id, (err, empresaEliminada) => {
            if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
            if (!empresaEliminada) return res.status(404).send({ mensaje: 'Error al eliminar la empresa' });

            return res.status(200).send({ empresa: empresaEliminada });
        })
    } else {
        return res.status(200).send({ empresa: 0 });
    }
}

function BuscarEmpresa(req, res) {
    if (req.user.rol == 'ADMIN') {
        Empresa.find((err, empresaEncontrada) => {
            if (err) return res.send({ mensaje: "Error: " + err })

            for (let i = 0; i < empresaEncontrada.length; i++) {
                console.log(empresaEncontrada[i].nombre)
            }

            return res.status(200).send({ empresa: empresaEncontrada });
        })
    } else {
        return res.status(200).send({ empresa: 0 });
    }
}

function BuscarEmpresaId(req, res) {
    if (req.user.rol == 'ADMIN') {
        var idEmpresa = req.params.idEmpresa

        Empresa.findById(idEmpresa, (err, empresaEncontrada) => {
            if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
            if (!empresaEncontrada) return res.status(404).send({ mensaje: 'Error al obtener los datos' });

            return res.status(200).send({ Empresa: empresaEncontrada });
        })
    } else {
        return res.status(200).send({ Empresa: 0 });
    }
}


module.exports = {
    creacionAdmin,
    registrar,
    login,
    AgregarEmpresa,
    EditarEmpresa,
    EliminarEmpresa,
    BuscarEmpresa,
    BuscarEmpresaId
}