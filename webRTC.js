const express = require('express');
const {createServer} = require('node:http');
const { Server } = require('socket.io');

const app = express();
const server = createServer(app);
const io = new Server(server);

app.get('/', (req, res) => {
    res.send('<h1>Hello world</h1>');
});

io.on('connection', (socket) => {
    console.log('a user connected');
  });

server.listen(3000, () => {
    console.log("rodando em http://localhost:3000")
})