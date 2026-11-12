
const express = require('express');

const app = express();

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

// Exporta a aplicação para outros arquivos
module.exports = app;

// Inicializa o servidor somente quando executado diretamente
if (require.main === module) {
    const PORT = 3001;

    app.listen(PORT, () => {
        console.log(`Servidor rodando na porta ${PORT}`);
    });
}
