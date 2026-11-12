const db = require('../database/database');
const bcrypt = require('bcrypt');

// Listar todos os usuários
function listarUsuarios(req, res) {
    const usuarios = db.prepare(
        'SELECT id, nome, email FROM usuarios'
    ).all();

    res.json(usuarios);
}

// Cadastrar um novo usuário
async function cadastrarUsuario(req, res) {
    const { nome, email, senha } = req.body;

    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (
    typeof nome !== 'string' ||
    !nome.trim() ||
    typeof email !== 'string' ||
    !email.trim() ||
    !emailValido ||
    typeof senha !== 'string' ||
    senha.length < 8
) {
    return res.status(400).json({
        mensagem: 'Nome, e-mail e senha devem ser preenchidos corretamente. A senha deve ter pelo menos 8 caracteres!'
    });
}

    try {
        const senhaHash = await bcrypt.hash(senha, 10);
        const resultado = db.prepare(`
        INSERT INTO usuarios (nome, email, senha_hash)
        VALUES (?, ?, ?)
`).run(nome.trim(), email.trim(), senhaHash);

        res.status(201).json({
            mensagem: 'Usuário cadastrado com sucesso!',
            usuario: {
                id: resultado.lastInsertRowid,
                nome: nome.trim(),
                email: email.trim()
            }
        });

    } catch (erro) {
        if (erro.code === 'SQLITE_CONSTRAINT_UNIQUE') {
            return res.status(409).json({
                mensagem: 'Este e-mail já está cadastrado!'
            });
        }

        console.error(erro);

        res.status(500).json({
            mensagem: 'Erro interno ao cadastrar usuário.'
        });
    }
}

// Atualizar um usuário
function atualizarUsuario(req, res) {
    const id = Number(req.params.id);
    const { nome, email } = req.body;

    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            mensagem: 'ID inválido!'
        });
    }

    // Validar os dados recebidos
    if (
        typeof nome !== 'string' ||
        !nome.trim() ||
        typeof email !== 'string' ||
        !email.trim() ||
        !emailValido
    ) {
        return res.status(400).json({
            mensagem: 'Nome e e-mail devem ser preenchidos corretamente!'
        });
    }

    try {
        // Atualizar usuário no banco de dados
        const resultado = db.prepare(`
            UPDATE usuarios
            SET nome = ?, email = ?
            WHERE id = ?
        `).run(nome.trim(), email.trim(), id);

        if (resultado.changes === 0) {
            return res.status(404).json({
                mensagem: 'Usuário não encontrado!'
            });
        }

        // Buscar usuário atualizado
        const usuarioAtualizado = db.prepare(
            'SELECT * FROM usuarios WHERE id = ?'
        ).get(id);

        res.json({
            mensagem: 'Usuário atualizado com sucesso!',
            usuario: usuarioAtualizado
        });

    } catch (erro) {
        if (erro.code === 'SQLITE_CONSTRAINT_UNIQUE') {
            return res.status(409).json({
                mensagem: 'Este e-mail já está cadastrado!'
            });
        }

        console.error(erro);

        res.status(500).json({
            mensagem: 'Erro interno ao atualizar usuário.'
        });
    }
}

// Excluir um usuário
function excluirUsuario(req, res) {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            mensagem: 'ID inválido!'
        });
    }

    const resultado = db.prepare(
        'DELETE FROM usuarios WHERE id = ?'
    ).run(id);

    if (resultado.changes === 0) {
        return res.status(404).json({
            mensagem: 'Usuário não encontrado!'
        });
    }

    res.json({
        mensagem: 'Usuário excluído com sucesso!'
    });
}

module.exports = {
    listarUsuarios,
    cadastrarUsuario,
    atualizarUsuario,
    excluirUsuario
};