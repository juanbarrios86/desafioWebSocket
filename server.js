const express = require('express')
const { Server: HttpServer } = require('http')
const { Server: Socket } = require('socket.io')

const ContenedorMemoria = require('./contenedores/ContenedorMemoria.js')
const ContenedorArchivo = require('./contenedores/ContenedorArchivo.js')


// realizo las instancias

const app = express()
const httpServer = new HttpServer(app)
const io = new Socket(httpServer)

const productosApi = new ContenedorMemoria()
const mensajesApi = new ContenedorArchivo('mensajes.json')

// configuro socket IO

io.on('connection', async socket => {
    console.log('Nuevo cliente conectado!');

    // carga de productos
    socket.emit('productos', productosApi.listarAll());

    // actualizacion de productos
    socket.on('update', producto => {
        productosApi.guardar(producto)
        io.sockets.emit('productos', productosApi.listarAll());
    })

    // carga de mensajes
    socket.emit('mensajes', await mensajesApi.listarAll());

    // actualizacion de mensajes
    socket.on('nuevoMensaje', async mensaje => {
        mensaje.fyh = new Date().toLocaleString()
        await mensajesApi.guardar(mensaje)
        io.sockets.emit('mensajes', await mensajesApi.listarAll());
    })
});


app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

// sintaxis del servidor

const PORT = 8080
const connectedServer = httpServer.listen(PORT, () => {
    console.log(`Servidor http escuchando en el puerto ${connectedServer.address().port}`)
})
connectedServer.on('error', error => console.log(`Error en servidor ${error}`))
