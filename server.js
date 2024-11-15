const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect('mongodb+srv://henrique:henriquedb@henriquedb.oqqyucc.mongodb.net/lumina?retryWrites=true&w=majority&appName=HenriqueDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB conectado!'))
  .catch((err) => console.log(err));

app.use('/api/auth', authRoutes);

app.listen(8000, () => console.log('Servidor rodando na porta 8000'));
