"use strict"; function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { newObj[key] = obj[key]; } } } newObj.default = obj; return newObj; } } function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }Object.defineProperty(exports, "__esModule", {value: true});var _yup = require('yup'); var Yup = _interopRequireWildcard(_yup);
var _usuarios = require('../models/usuarios'); var _usuarios2 = _interopRequireDefault(_usuarios);
var _arquivos = require('../models/arquivos'); var _arquivos2 = _interopRequireDefault(_arquivos);

class UsuarioController {
  async index(req, res) {
    const usuario = await _usuarios2.default.findByPk(req.usuario_id, {
      attributes: ['id', 'nome', 'email'],
      include: [
        {
          model: _arquivos2.default,
          as: 'avatar',
          attributes: ['id', 'arquivo', 'url'],
        },
      ],
    });
    return res.json(usuario);
  }

  async store(req, res) {
    /** Validação dos dados entrada */
    const schema = Yup.object().shape({
      nome: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      senha: Yup.string().required(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ erro: 'Dados inválidos' });
    }

    const usuario = await _usuarios2.default.create(req.body);

    return res.json({ mensagem: 'Usuário criado!', usuario });
  }

  async update(req, res) {
    /** Validação dos dados de entrada */
    const schema = Yup.object().shape({
      nome: Yup.string(),
      avatar_id: Yup.number(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ erro: 'Dados inválidos' });
    }

    const usuario = await _usuarios2.default.findByPk(req.usuario_id, {
      attributes: ['id', 'nome', 'email', 'avatar_id'],
      include: [
        {
          model: _arquivos2.default,
          as: 'avatar',
          attributes: ['id', 'arquivo', 'url'],
        },
      ],
    });

    if (!usuario) {
      return res.status(404).json({ erro: 'Usuário não localizado' });
    }

    usuario.update({ nome: req.body.nome, avatar_id: req.body.avatar_id });

    return res.json({
      mensagem: 'Cadastro atualizado com sucesso!',
      usuario,
    });
  }
}

exports. default = new UsuarioController();
