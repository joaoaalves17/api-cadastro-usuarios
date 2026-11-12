
const express = require('express');
const db = require('../database/database');

const router = express.Router();

// Listar todos os usuários
router.get('/', (req, res) => {
    const usuarios = db.prepare('SELECT * FROM usuarios').all();

    res.json(usuarios);
});

// Cadastrar um usuário
router.post('/', (req, res) => {
    const { nome, email } = req.body;
    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    
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
        const resultado = db.prepare(`
            INSERT INTO usuarios (nome, email)
            VALUES (?, ?)
        `).run(nome.trim(), email.trim());

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
});

 
// Atualizar um usuário

router.put('/:id', (req, res) => {
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
});


// Excluir um usuário
router.delete('/:id', (req, res) => {
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
});


module.exports = router;
