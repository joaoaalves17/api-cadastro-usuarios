
const express = require('express');
const usuariosController = require('../controllers/usuariosController');
const autenticarToken = require('../middlewares/authMiddleware');

const router = express.Router();

// Listar usuários (protegido)
router.get('/', autenticarToken, usuariosController.listarUsuarios);

// Cadastrar usuário (público)
router.post('/', usuariosController.cadastrarUsuario);

// Atualizar usuário (protegido)
router.put('/:id', autenticarToken, usuariosController.atualizarUsuario);

// Excluir usuário (protegido)
router.delete('/:id', autenticarToken, usuariosController.excluirUsuario);

module.exports = router;
