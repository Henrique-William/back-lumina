const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

let clientQueue = [];
let proQueue = [];

io.on("connection", (socket) => {
  console.log("Usuário conectado:", socket.id);

  // Cliente entra na fila
  socket.on("join_client_queue", (clientId) => {
    if (!clientId) {
      return socket.emit("error", "ID do cliente é obrigatório.");
    }
    if (clientQueue.some((item) => item.clientId === clientId)) {
      return socket.emit("error", "Cliente já está na fila.");
    }
    clientQueue.push({ clientId, socketId: socket.id });
    console.log("Cliente entrou na fila:", clientId);
    io.emit("update_queue", { clientQueue, proQueue });
  });

  // Profissional entra na fila
  socket.on("join_pro_queue", (proId) => {
    console.log("Profissional entrou na fila:", proId);
    proQueue.push({ proId, socketId: socket.id });
    io.emit("update_queue", { clientQueue, proQueue });
    socket.on("next_client", () => {
      console.log("Tentando atribuir próximo cliente");
    });
  });

  // No backend (queue.js)
  socket.on("next_client", () => {
    if (clientQueue.length > 0 && proQueue.length > 0) {
      const client = clientQueue.shift();
      const pro = proQueue.shift();

      console.log("Atendimento iniciado:", { client, pro });

      const clientDetails = "Detalhes adicionais"; // Substitua por dados reais
      const clientName = "Nome do Cliente"; // Substitua por dados reais

      io.to(client.socketId).emit("assigned", { proId: pro.proId });
      io.to(pro.socketId).emit("assigned", {
        clientId: client.clientId,
        clientName: clientName,
        clientDetails: clientDetails,
      });

      io.emit("update_queue", { clientQueue, proQueue });
    } else {
      socket.emit("no_match", "Sem clientes ou profissionais disponíveis.");
    }
  });

  // Desconexão
  socket.on("disconnect", () => {
    console.log("Usuário desconectado:", socket.id);
    clientQueue = clientQueue.filter((item) => item.socketId !== socket.id);
    proQueue = proQueue.filter((item) => item.socketId !== socket.id);
    io.emit("update_queue", { clientQueue, proQueue });
  });
});

const PORT = 3000;
server.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
