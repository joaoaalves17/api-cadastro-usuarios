
const { test } = require('node:test');
const assert = require('node:assert');

const request = require('supertest');

// Utiliza um banco de dados em memória durante os testes
process.env.DB_FILE = ':memory:';

// Chave exclusiva para os testes automatizados
process.env.JWT_SECRET = 'chave-secreta-para-testes';

const jwt = require('jsonwebtoken');

const app = require('../src/server');

// Gera um token de autenticação para os testes
const token = jwt.sign(
    { id: 1 },
    process.env.JWT_SECRET
);

// Teste da rota GET /usuarios
test('Deve listar todos os usuários', async () => {
    const resposta = await request(app)
        .get('/usuarios')
        .set('Authorization', `Bearer ${token}`);

    assert.strictEqual(resposta.status, 200);
    assert.deepStrictEqual(resposta.body, []);
});


test('Deve cadastrar um novo usuário', async () => {
    const resposta = await request(app)
        .post('/usuarios')
        .send({
    nome: 'João Silva',
    email: 'joao.teste@email.com',
    senha: 'Senha123'
});

    assert.strictEqual(resposta.status, 201);
    assert.strictEqual(
        resposta.body.mensagem,
        'Usuário cadastrado com sucesso!'
    );
    assert.strictEqual(resposta.body.usuario.nome, 'João Silva');
    assert.strictEqual(
        resposta.body.usuario.email,
        'joao.teste@email.com'
    );
});

test('Deve realizar login com credenciais válidas', async () => {
    const resposta = await request(app)
        .post('/auth/login')
        .send({
            email: 'joao.teste@email.com',
            senha: 'Senha123'
        });

    assert.strictEqual(resposta.status, 200);
    assert.strictEqual(
        resposta.body.mensagem,
        'Login realizado com sucesso!'
    );
    assert.strictEqual(typeof resposta.body.token, 'string');
});

test('Não deve permitir cadastrar e-mail duplicado', async () => {
    const resposta = await request(app)
        .post('/usuarios')
        .send({
    nome: 'Outro Usuário',
    email: 'joao.teste@email.com',
    senha: 'Senha123'
});

    assert.strictEqual(resposta.status, 409);
    assert.strictEqual(
        resposta.body.mensagem,
        'Este e-mail já está cadastrado!'
    );
});


test('Não deve cadastrar usuário com dados inválidos', async () => {
    const resposta = await request(app)
        .post('/usuarios')
        .send({
            nome: '',
            email: 'email-invalido'
        });

    assert.strictEqual(resposta.status, 400);
    assert.equal(
    resposta.body.mensagem,
    'Nome, e-mail e senha devem ser preenchidos corretamente. A senha deve ter pelo menos 8 caracteres!'
);
});


test('Deve atualizar um usuário existente', async () => {
    const resposta = await request(app)
        .put('/usuarios/1')
        .set('Authorization', `Bearer ${token}`)
        .send({
            nome: 'João Atualizado',
            email: 'joao.atualizado@email.com'
        });
        
    assert.strictEqual(resposta.status, 200);
    assert.strictEqual(
        resposta.body.mensagem,
        'Usuário atualizado com sucesso!'
    );
    assert.strictEqual(
        resposta.body.usuario.nome,
        'João Atualizado'
    );
    assert.strictEqual(
        resposta.body.usuario.email,
        'joao.atualizado@email.com'
    );
});


test('Não deve atualizar usuário inexistente', async () => {
    const resposta = await request(app)
        .put('/usuarios/999')
        .set('Authorization', `Bearer ${token}`)
        .send({
            nome: 'Usuário Inexistente',
            email: 'inexistente@email.com'
        });

    assert.strictEqual(resposta.status, 404);
    assert.strictEqual(
        resposta.body.mensagem,
        'Usuário não encontrado!'
    );
});


test('Deve excluir um usuário existente', async () => {
    const resposta = await request(app)
    .delete('/usuarios/1')
    .set('Authorization', `Bearer ${token}`);

    assert.strictEqual(resposta.status, 200);
    assert.strictEqual(
        resposta.body.mensagem,
        'Usuário excluído com sucesso!'
    );

    // Verifica se o usuário realmente foi removido
    const consulta = await request(app)
    .get('/usuarios')
    .set('Authorization', `Bearer ${token}`);

    assert.deepStrictEqual(consulta.body, []);
});


test('Não deve excluir usuário inexistente', async () => {
    const resposta = await request(app)
    .delete('/usuarios/999')
    .set('Authorization', `Bearer ${token}`);

    assert.strictEqual(resposta.status, 404);
    assert.strictEqual(
        resposta.body.mensagem,
        'Usuário não encontrado!'
    );
});


test('Não deve atualizar usuário com ID inválido', async () => {
    const resposta = await request(app)
    .put('/usuarios/abc')
    .set('Authorization', `Bearer ${token}`)
        .send({
            nome: 'João',
            email: 'joao@email.com'
        });

    assert.strictEqual(resposta.status, 400);
    assert.strictEqual(resposta.body.mensagem, 'ID inválido!');
});

test('Não deve excluir usuário com ID inválido', async () => {
    const resposta = await request(app)
    .delete('/usuarios/abc')
    .set('Authorization', `Bearer ${token}`);

    assert.strictEqual(resposta.status, 400);
    assert.strictEqual(resposta.body.mensagem, 'ID inválido!');
});

test('Não deve listar usuários sem token', async () => {
    const resposta = await request(app)
        .get('/usuarios');

    assert.strictEqual(resposta.status, 401);
    assert.strictEqual(
        resposta.body.mensagem,
        'Acesso negado! Token não informado.'
    );
});

test('Não deve listar usuários com token inválido', async () => {
    const resposta = await request(app)
        .get('/usuarios')
        .set('Authorization', 'Bearer token-falso-123');

    assert.strictEqual(resposta.status, 401);
    assert.strictEqual(
        resposta.body.mensagem,
        'Token inválido ou expirado!'
    );
});

test('Não deve realizar login com senha incorreta', async () => {
    const resposta = await request(app)
        .post('/auth/login')
        .send({
            email: 'joao.teste@email.com',
            senha: 'SenhaErrada123'
        });

    assert.strictEqual(resposta.status, 401);
    assert.strictEqual(
        resposta.body.mensagem,
        'E-mail ou senha inválidos!'
    );
});