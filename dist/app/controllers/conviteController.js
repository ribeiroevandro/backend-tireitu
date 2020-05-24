"use strict"; function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { newObj[key] = obj[key]; } } } newObj.default = obj; return newObj; } } function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }Object.defineProperty(exports, "__esModule", {value: true});var _mail = require('@sendgrid/mail'); var _mail2 = _interopRequireDefault(_mail);
var _yup = require('yup'); var Yup = _interopRequireWildcard(_yup);
var _crypto = require('crypto'); var _crypto2 = _interopRequireDefault(_crypto);
var _datefns = require('date-fns');
var _pt = require('date-fns/locale/pt'); var _pt2 = _interopRequireDefault(_pt);

var _convites = require('../models/convites'); var _convites2 = _interopRequireDefault(_convites);
var _grupos = require('../models/grupos'); var _grupos2 = _interopRequireDefault(_grupos);

class ConviteController {
  async store(req, res) {
    /** Validação dos dados entrada */
    const schema = Yup.object().shape({
      nome: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ erro: 'Dados inválidos' });
    }

    const convidado = req.body;
    const grupo = await _grupos2.default.findByPk(req.params.grupo_id);

    const hash = _crypto2.default.randomBytes(2);
    const codigo_gerado = hash.toString('hex');

    const novoConvite = await _convites2.default.create({
      usuario_id: req.usuario_id,
      codigo_convite: codigo_gerado,
      grupo_id: grupo.id,
    });

    /** Enviar E-mail */
    _mail2.default.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
      to: `${convidado.nome} <${convidado.email}>`,
      from: 'TireiTu App <noreply@apptireitu.com.br>',
      templateId: 'd-e2fd20480f184a3491d1b3f3253d5c9c',
      dynamic_template_data: {
        subject: 'Convite para amigo secreto',
        nome: `${convidado.nome}`,
        nome_grupo: `${grupo.nome}`,
        data_confraternizacao: _datefns.format.call(void 0, 
          grupo.data_confraternizacao,
          "dd 'de' MMMM 'de' yyy",
          {
            locale: _pt2.default,
          }
        ),
        local_confraternizacao: `${grupo.local_confraternizacao}`,
        valor_minimo: `${grupo.valor_minimo}`,
        data_sorteio: _datefns.format.call(void 0, grupo.data_sorteio, "dd 'de' MMMM 'de' yyy", {
          locale: _pt2.default,
        }),
        codigo_convite: `${novoConvite.id}-${codigo_gerado}-${grupo.id}`,
      },
    };
    _mail2.default.send(msg);

    return res.json({
      mensagem: 'Convite gerado com sucesso!',
      convidado,
      novoConvite,
    });
  }
}

exports. default = new ConviteController();
