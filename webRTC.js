const express = require('express');
const { createServer } = require('node:http');
const { Server } = require('socket.io');

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:8081', // Permite todas as origens (ajuste conforme necessário)
        methods: ['GET', 'POST']
    }
});

app.get('/', (req, res) => {
    res.send('<h1>Hello world</h1>');
});

io.on('connection', (socket) => {
    console.log(`Usuário conectado: ${socket.id}`);

    socket.on('queue', (data) => {
        console.log(`Evento "queue" recebido de ${socket.id}:`, data);
        socket.emit('response', { message: 'Evento recebido com sucesso!' });
    });

    socket.on('disconnect', (reason) => {
        console.log(`Usuário desconectado: ${socket.id} (${reason})`);
    });
});


server.listen(3000, () => {
    console.log("rodando em http://localhost:3000")
});