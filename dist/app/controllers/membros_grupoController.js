"use strict"; function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { newObj[key] = obj[key]; } } } newObj.default = obj; return newObj; } } function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }Object.defineProperty(exports, "__esModule", {value: true});var _yup = require('yup'); var Yup = _interopRequireWildcard(_yup);
var _grupos = require('../models/grupos'); var _grupos2 = _interopRequireDefault(_grupos);
var _usuarios = require('../models/usuarios'); var _usuarios2 = _interopRequireDefault(_usuarios);
var _membros_grupo = require('../models/membros_grupo'); var _membros_grupo2 = _interopRequireDefault(_membros_grupo);
var _convites = require('../models/convites'); var _convites2 = _interopRequireDefault(_convites);
var _arquivos = require('../models/arquivos'); var _arquivos2 = _interopRequireDefault(_arquivos);

var _notification = require('../schemas/notification'); var _notification2 = _interopRequireDefault(_notification);

class Membros_grupoController {
  async index(req, res) {
    const grupo = req.params.grupo_id;

    const usuarios_grupo = await _membros_grupo2.default.findAll({
      include: [
        {
          model: _usuarios2.default,
          as: 'usuario',
          attributes: ['id', 'nome', 'email'],
          include: [
            {
              model: _arquivos2.default,
              as: 'avatar',
              attributes: ['id', 'nome', 'url'],
            },
          ],
        },
        {
          model: _grupos2.default,
          as: 'grupo',
          attributes: ['id', 'nome'],
        },
      ],
      attributes: ['id', 'moderador', 'usuario_id', 'grupo_id'],
      where: { grupo_id: grupo },
    });

    return res.json({ usuarios_grupo });
  }

  async store(req, res) {
    /** Validação dos dados entrada */
    const schema = Yup.object().shape({
      codigo_convite: Yup.string().required(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ erro: 'Dados inválidos' });
    }

    const usuario = await _usuarios2.default.findByPk(req.params.convidado_id);
    if (!usuario) {
      return res.json({ error: 'Usuário não cadastrado' });
    }

    /** Verificação de código de convite */
    const { codigo_convite } = req.body;
    const [convite_id, token, grupo] = codigo_convite.split('-');

    const busca_convite = await _convites2.default.findByPk(convite_id);

    if (!(await busca_convite.checkPassword(token))) {
      return res.status(404).json({ erro: 'Código inválido! Favor verifique' });
    }
    if (busca_convite.grupo_id !== Number(grupo)) {
      return res
        .status(404)
        .json({ erro: 'Este código não pertence a este grupo!' });
    }
    if (busca_convite.status_usado === true) {
      return res.status(404).json({
        erro:
          'Código já ultilizado. Solicite um novo código ao moderador do grupo',
      });
    }

    await busca_convite.update({ status_usado: true });

    /** Verifica se usuário já está no grupo */
    const checkGrupo = await _membros_grupo2.default.findAll({
      where: { usuario_id: usuario.id, grupo_id: busca_convite.grupo_id },
    });
    if (checkGrupo.length >= 1) {
      return res.status(401).json({ erro: 'Usuário já pertence ao grupo' });
    }

    /** Entrada do usuario no grupo */
    const entrar_grupo = await _membros_grupo2.default.create({
      usuario_id: usuario.id,
      grupo_id: busca_convite.grupo_id,
    });

    const buscaGrupo = await _grupos2.default.findByPk(busca_convite.grupo_id);

    await buscaGrupo.update({ participantes: buscaGrupo.participantes + 1 });

    /** Notificar sobre a entrada no grupo */
    const participantes = await _membros_grupo2.default.findAll({
      include: [
        {
          model: _usuarios2.default,
          as: 'usuario',
          attributes: ['id', 'nome'],
        },
      ],
      attributes: ['id', 'moderador', 'usuario_id', 'grupo_id', 'sorteado_id'],
      where: { grupo_id: busca_convite.grupo_id },
    });

    participantes.forEach(async membro => {
      await _notification2.default.create({
        mensagem: `É Festaaa! ${usuario.nome} entrou no grupo!`,
        usuario: membro.usuario_id,
      });
    });

    return res.json({
      mensagem: 'Usuário adicionado ao grupo!',
      usuario,
      entrar_grupo,
    });
  }
}

exports. default = new Membros_grupoController();
