const express=require('express')
const cors=require('cors')
var app = express()

const usuarioRutas=require('./src/routes/usuarios.routes')

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(cors());

app.use('/api', usuarioRutas);


module.exports = app;