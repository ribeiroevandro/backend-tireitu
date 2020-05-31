"use strict"; function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { newObj[key] = obj[key]; } } } newObj.default = obj; return newObj; } } function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }Object.defineProperty(exports, "__esModule", {value: true});var _jsonwebtoken = require('jsonwebtoken'); var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);
var _yup = require('yup'); var Yup = _interopRequireWildcard(_yup);
var _auth = require('../../config/auth'); var _auth2 = _interopRequireDefault(_auth);
var _usuarios = require('../models/usuarios'); var _usuarios2 = _interopRequireDefault(_usuarios);
var _arquivos = require('../models/arquivos'); var _arquivos2 = _interopRequireDefault(_arquivos);

class SessaoController {
  async store(req, res) {
    try {
      const schema = Yup.object().shape({
        email: Yup.string()
          .email()
          .required(),
        senha: Yup.string().required(),
      });
      if (!(await schema.isValid(req.body))) {
        return res.status(401).json({ erro: 'Dados inválidos!' });
      }
      const { email, senha } = req.body;

      const usuario = await _usuarios2.default.findOne({
        where: { email },
        include: [
          {
            model: _arquivos2.default,
            as: 'avatar',
            attributes: ['id', 'arquivo', 'url'],
          },
        ],
      });

      if (!usuario) {
        return res.status(401).json({ erro: 'E-mail inválido!' });
      }
      if (!(await usuario.checkPassword(senha))) {
        return res.status(401).json({ erro: 'Senha inválida!' });
      }

      const { id, nome, avatar } = usuario;

      return res.json({
        mensagem: 'Sessão Criada',
        id,
        nome,
        email,
        avatar,
        token: _jsonwebtoken2.default.sign({ id }, _auth2.default.secret, {
          expiresIn: _auth2.default.expiresIn,
        }),
      });
    } catch (error) {
      return console.log('error ao tentar criar sessão', error);
    }
  }
}

exports. default = new SessaoController();
