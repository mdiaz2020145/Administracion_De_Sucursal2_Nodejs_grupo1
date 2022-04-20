exports.verAdministrador=function(req, res, next) {
    if(req.user.rol!=="ADMIN") return res.status(403).send({mensaje: "Solo el administrador puede continuar"});

    next();
}

exports.verEmpresa=function(req, res, next) {
    if(req.user.rol!=="EMPRESA") return res.status(403).send({mensaje: "Solo una empresa puede continuar"});

    next();
}