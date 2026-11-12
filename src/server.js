
const express = require('express');

const app = express();

const PORT = 3001;

// Permite receber dados em JSON
app.use(express.json());

// Importa as rotas de usuários
const usuariosRoutes = require('./routes/usuarios');

// Rota principal
app.get('/', (req, res) => {
    res.send('API de Cadastro de Usuários está funcionando!');
});

// Utiliza as rotas de usuários
app.use('/usuarios', usuariosRoutes);

// Inicialização do servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
