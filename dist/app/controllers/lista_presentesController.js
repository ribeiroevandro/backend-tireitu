"use strict"; function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { newObj[key] = obj[key]; } } } newObj.default = obj; return newObj; } } function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }Object.defineProperty(exports, "__esModule", {value: true});var _yup = require('yup'); var Yup = _interopRequireWildcard(_yup);
var _lista_presentes = require('../models/lista_presentes'); var _lista_presentes2 = _interopRequireDefault(_lista_presentes);
var _usuarios = require('../models/usuarios'); var _usuarios2 = _interopRequireDefault(_usuarios);

class Lista_presentesController {
  async index(req, res) {
    const lista_desejo = await _lista_presentes2.default.findOne({
      where: { usuario_id: req.usuario_id },
      attributes: ['id', 'opcao_1', 'opcao_2', 'opcao_3'],
    });
    return res.json(lista_desejo);
  }

  async show(req, res) {
    const usuario_lista_desejo = await _lista_presentes2.default.findOne({
      where: { usuario_id: req.params.usuario_id },
      attributes: ['id', 'opcao_1', 'opcao_2', 'opcao_3'],
    });
    return res.json(usuario_lista_desejo);
  }

  async store(req, res) {
    /** Validação dos dados entrada */
    const schema = Yup.object().shape({
      opcao_1: Yup.string().required(),
      opcao_2: Yup.string().required(),
      opcao_3: Yup.string().required(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ erro: 'Dados inválidos' });
    }

    const usuario = await _usuarios2.default.findByPk(req.usuario_id);
    if (!usuario) {
      return res.status(404).json({ erro: 'Usuário não localizado!' });
    }

    const { opcao_1, opcao_2, opcao_3 } = await _lista_presentes2.default.create({
      usuario_id: usuario.id,
      opcao_1: req.body.opcao_1,
      opcao_2: req.body.opcao_2,
      opcao_3: req.body.opcao_3,
    });

    return res.json({
      sucesso: 'Lista de presentes criada com sucesso!',
      opcao_1,
      opcao_2,
      opcao_3,
    });
  }

  async update(req, res) {
    /** Validação dos dados entrada */
    const schema = Yup.object().shape({
      opcao_1: Yup.string(),
      opcao_2: Yup.string(),
      opcao_3: Yup.string(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ erro: 'Dados inválidos' });
    }

    const lista_presente = await _lista_presentes2.default.findByPk(
      req.params.presente_id
    );
    if (!lista_presente) {
      return res.status(404).json({ erro: 'lista não localizada!' });
    }
    lista_presente.update(req.body);
    lista_presente.save();

    return res.json({
      sucesso: 'Lista de presentes atualizada com sucesso!',
      lista_presente,
    });
  }
}

exports. default = new Lista_presentesController();
