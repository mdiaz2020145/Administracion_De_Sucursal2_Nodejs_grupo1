const mongoose = require('mongoose')
const empresasController= require('./src/controllers/empresas.controller')
const app = require('./app')

mongoose.Promise=global.Promise;
mongoose.connect('mongodb://localhost:27017/SucursalesGrupo1', {useNewUrlParser: true, useUnifiedTopology: true}).then(() => {
    console.log('Conexion a la base de datos exitosa')

    app.listen(3000, function () {
        empresasController.creacionAdmin()
        console.log('Corriendo en el puerto 3000') 
    })
}).catch(err => console.log(err))