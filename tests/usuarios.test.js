
const { test } = require('node:test');
const assert = require('node:assert');

const request = require('supertest');

// Utiliza um banco de dados em memória durante os testes
process.env.DB_FILE = ':memory:';

const app = require('../src/server');

// Teste da rota GET /usuarios
test('Deve listar todos os usuários', async () => {
    const resposta = await request(app)
        .get('/usuarios');

    assert.strictEqual(resposta.status, 200);
    assert.deepStrictEqual(resposta.body, []);
});


test('Deve cadastrar um novo usuário', async () => {
    const resposta = await request(app)
        .post('/usuarios')
        .send({
            nome: 'João Silva',
            email: 'joao.teste@email.com'
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


test('Não deve permitir cadastrar e-mail duplicado', async () => {
    const resposta = await request(app)
        .post('/usuarios')
        .send({
            nome: 'Outro João',
            email: 'joao.teste@email.com'
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
    assert.strictEqual(
        resposta.body.mensagem,
        'Nome e e-mail devem ser preenchidos corretamente!'
    );
});


test('Deve atualizar um usuário existente', async () => {
    const resposta = await request(app)
        .put('/usuarios/1')
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
        .delete('/usuarios/1');

    assert.strictEqual(resposta.status, 200);
    assert.strictEqual(
        resposta.body.mensagem,
        'Usuário excluído com sucesso!'
    );

    // Verifica se o usuário realmente foi removido
    const consulta = await request(app)
        .get('/usuarios');

    assert.deepStrictEqual(consulta.body, []);
});


test('Não deve excluir usuário inexistente', async () => {
    const resposta = await request(app)
        .delete('/usuarios/999');

    assert.strictEqual(resposta.status, 404);
    assert.strictEqual(
        resposta.body.mensagem,
        'Usuário não encontrado!'
    );
});


test('Não deve atualizar usuário com ID inválido', async () => {
    const resposta = await request(app)
        .put('/usuarios/abc')
        .send({
            nome: 'João',
            email: 'joao@email.com'
        });

    assert.strictEqual(resposta.status, 400);
    assert.strictEqual(resposta.body.mensagem, 'ID inválido!');
});

test('Não deve excluir usuário com ID inválido', async () => {
    const resposta = await request(app)
        .delete('/usuarios/abc');

    assert.strictEqual(resposta.status, 400);
    assert.strictEqual(resposta.body.mensagem, 'ID inválido!');
});
