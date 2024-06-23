const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Servir arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, '..', 'public')));

// Armazenar localizações dos usuários
let usersLocations = {};

io.on('connection', (socket) => {
    console.log('Novo cliente conectado:', socket.id);

    socket.on('updateLocation', (location) => {
        usersLocations[socket.id] = location;
        io.emit('locationUpdate', usersLocations);
    });

    socket.on('disconnect', () => {
        console.log('Cliente desconectado:', socket.id);
        delete usersLocations[socket.id];
        io.emit('locationUpdate', usersLocations);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Servidor iniciado na porta ${PORT}`);
});