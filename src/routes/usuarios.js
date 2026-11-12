
const express = require('express');
const usuariosController = require('../controllers/usuariosController');

const router = express.Router();

// Listar todos os usuários

router.get('/', usuariosController.listarUsuarios);

// Cadastrar um usuário

router.post('/', usuariosController.cadastrarUsuario);

// Atualizar um usuário

router.put('/:id', usuariosController.atualizarUsuario);

// Excluir um usuário

router.delete('/:id', usuariosController.excluirUsuario);

module.exports = router;
