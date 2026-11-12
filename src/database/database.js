
const Database = require('better-sqlite3');
const path = require('path');

// Define onde o banco de dados será armazenado
const caminhoBanco = process.env.DB_FILE || path.resolve(__dirname, 'usuarios.db');

// Cria ou conecta ao banco de dados
const db = new Database(caminhoBanco);

// Cria a tabela de usuários, caso ainda não exista
db.exec(`
    CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE
    )
`);

// Adiciona a coluna de senha criptografada, caso ainda não exista
const colunas = db.prepare('PRAGMA table_info(usuarios)').all();

if (!colunas.some(coluna => coluna.name === 'senha_hash')) {
    db.exec('ALTER TABLE usuarios ADD COLUMN senha_hash TEXT');
}

// Impede o cadastro de e-mails duplicados
db.exec(`
    CREATE UNIQUE INDEX IF NOT EXISTS idx_usuarios_email
    ON usuarios(email)
`);

console.log('Banco de dados conectado com sucesso!');

// Exporta a conexão para outros arquivos
module.exports = db;
