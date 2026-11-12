
const jwt = require('jsonwebtoken');

// Verificar autenticação do usuário
function autenticarToken(req, res, next) {
    const cabecalho = req.headers.authorization;

    const [tipo, token] = cabecalho?.split(' ') || [];

    if (tipo !== 'Bearer' || !token) {
        return res.status(401).json({
            mensagem: 'Acesso negado! Token não informado.'
        });
    }

    try {
        const dadosToken = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.usuario = dadosToken;

        next();

    } catch (erro) {
        return res.status(401).json({
            mensagem: 'Token inválido ou expirado!'
        });
    }
}

module.exports = autenticarToken;
