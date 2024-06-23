const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve arquivos estáticos da pasta 'public'
app.use(express.static('public'));

// Armazenar localizações dos usuários
let usersLocations = {};

io.on('connection', (socket) => {
    console.log('Novo cliente conectado:', socket.id, Date.UTC());

    socket.on('updateLocation', (location) => {
        usersLocations[socket.id] = location;
        io.emit('locationUpdate', usersLocations);
        console.log(usersLocations)
    });

    socket.on('disconnect', () => {
        console.log('Cliente desconectado:', socket.id);
        delete usersLocations[socket.id];
        io.emit('locationUpdate', usersLocations);
    });
});

server.listen(3000, () => {
    console.log('Servidor iniciado na porta 3000');
});
