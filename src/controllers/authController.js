
const db = require('../database/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Realizar login
async function login(req, res) {
    const { email, senha } = req.body;

    if (
        typeof email !== 'string' ||
        !email.trim() ||
        typeof senha !== 'string' ||
        !senha.trim()
    ) {
        return res.status(400).json({
            mensagem: 'E-mail e senha devem ser informados!'
        });
    }

    const usuario = db.prepare(
        'SELECT * FROM usuarios WHERE email = ?'
    ).get(email.trim());

    if (!usuario || !usuario.senha_hash) {
        return res.status(401).json({
            mensagem: 'E-mail ou senha inválidos!'
        });
    }

    const senhaCorreta = await bcrypt.compare(
        senha,
        usuario.senha_hash
    );

    if (!senhaCorreta) {
        return res.status(401).json({
            mensagem: 'E-mail ou senha inválidos!'
        });
    }

    const token = jwt.sign(
        { id: usuario.id },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );

    return res.status(200).json({
        mensagem: 'Login realizado com sucesso!',
        token
    });
}

module.exports = {
    login
};
