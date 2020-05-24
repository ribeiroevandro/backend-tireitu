"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }Object.defineProperty(exports, "__esModule", {value: true});var _datefns = require('date-fns');
var _pt = require('date-fns/locale/pt'); var _pt2 = _interopRequireDefault(_pt);
var _mail = require('@sendgrid/mail'); var _mail2 = _interopRequireDefault(_mail);
var _membros_grupo = require('../models/membros_grupo'); var _membros_grupo2 = _interopRequireDefault(_membros_grupo);
var _grupos = require('../models/grupos'); var _grupos2 = _interopRequireDefault(_grupos);
var _usuarios = require('../models/usuarios'); var _usuarios2 = _interopRequireDefault(_usuarios);
var _notification = require('../schemas/notification'); var _notification2 = _interopRequireDefault(_notification);
var _mail3 = require('../../lib/mail'); var _mail4 = _interopRequireDefault(_mail3);

class SorteioController {
  async update(req, res) {
    /** Valida se grupo já foi sorteado */
    const checkSorteio = await _grupos2.default.findOne({
      where: { id: req.params.grupo_id, status_sorteio: true },
    });
    if (checkSorteio) {
      return res.status(401).json({ erro: 'Este grupo já foi sorteado!' });
    }

    const usuarios_grupo = await _membros_grupo2.default.findAll({
      include: [
        {
          model: _usuarios2.default,
          as: 'usuario',
          attributes: ['id', 'nome', 'email'],
        },
        {
          model: _usuarios2.default,
          as: 'sorteado',
          attributes: ['id', 'nome', 'email'],
        },
        {
          model: _grupos2.default,
          as: 'grupo',
          attributes: ['id', 'nome'],
        },
      ],
      attributes: ['id', 'moderador', 'usuario_id', 'grupo_id', 'sorteado_id'],
      where: { grupo_id: req.params.grupo_id },
    });

    const usuariosID = usuarios_grupo.map(usuario => usuario.usuario_id).sort();

    /** Embaralha os usuários */
    function embaralhar(usuarios) {
      let indice_atual = usuarios.length;
      let valor_temporario;
      let indice_aleatorio;
      while (indice_atual !== 0) {
        indice_aleatorio = Math.floor(Math.random() * indice_atual);
        indice_atual -= 1;
        valor_temporario = usuarios[indice_atual];
        usuarios[indice_atual] = usuarios[indice_aleatorio];
        usuarios[indice_aleatorio] = valor_temporario;
      }
      return usuarios;
    }

    const sorteio = embaralhar(usuariosID);

    /** Atualiza no banco o resultado do sorteio */
    sorteio.forEach(async (id, index) => {
      const ultimo_usuario = sorteio[sorteio.length - 1];
      switch (id === ultimo_usuario) {
        case false:
          await _membros_grupo2.default.update(
            { sorteado_id: sorteio[index + 1] },
            {
              where: { usuario_id: id, grupo_id: req.params.grupo_id },
            }
          );

          break;

        default:
          await _membros_grupo2.default.update(
            { sorteado_id: sorteio[0] },
            {
              where: { usuario_id: id, grupo_id: req.params.grupo_id },
            }
          );

          break;
      }
    });

    /** Atualiza o status do grupo para sorteado */
    await _grupos2.default.update(
      { status_sorteio: true },
      { where: { id: req.params.grupo_id } }
    );

    /** Notifica aos usuários sobre o sorteio realizado */
    const participantes = await _membros_grupo2.default.findAll({
      include: [
        {
          model: _usuarios2.default,
          as: 'usuario',
          attributes: ['id', 'nome'],
        },
        {
          model: _usuarios2.default,
          as: 'sorteado',
          attributes: ['id', 'nome', 'email'],
        },
        {
          model: _grupos2.default,
          as: 'grupo',
          attributes: [
            'id',
            'nome',
            'data_confraternizacao',
            'local_confraternizacao',
            'valor_minimo',
          ],
        },
      ],
      attributes: ['id', 'moderador', 'usuario_id', 'grupo_id', 'sorteado_id'],
      where: { grupo_id: req.params.grupo_id, moderador: false },
    });

    participantes.forEach(async usuario => {
      await _notification2.default.create({
        mensagem: `VENHA VER!!! O sorteio do grupo foi realizado! Veja quem você tirou.`,
        usuario: usuario.usuario_id,
      });
    });

    /** Envia um E-mail para todos os usuários
     *  do grupo com os dados do sorteio realizado
     *  */
    const email_usuarios = await _membros_grupo2.default.findAll({
      include: [
        {
          model: _usuarios2.default,
          as: 'usuario',
          attributes: ['id', 'nome', 'email'],
        },
        {
          model: _usuarios2.default,
          as: 'sorteado',
          attributes: ['id', 'nome', 'email'],
        },
        {
          model: _grupos2.default,
          as: 'grupo',
          attributes: [
            'id',
            'nome',
            'data_confraternizacao',
            'local_confraternizacao',
            'valor_minimo',
          ],
        },
      ],
      attributes: ['id', 'moderador', 'usuario_id', 'grupo_id', 'sorteado_id'],
      where: { grupo_id: req.params.grupo_id },
    });

    email_usuarios.forEach(async usuario => {
      _mail2.default.setApiKey(process.env.SENDGRID_API_KEY);
      const msg = {
        to: `${usuario.usuario.nome} <${usuario.usuario.email}>`,
        from: 'TireiTu App <noreply@apptireitu.com.br>',
        templateId: 'd-a02f3e3071734afdabf1a32f9c29f6ce',
        dynamic_template_data: {
          subject: 'Sorteio Realizado',
          nome: `${usuario.usuario.nome}`,
          sorteado: `${usuario.sorteado.nome}`,
          nome_grupo: `${usuario.grupo.nome}`,
          data_confraternizacao: _datefns.format.call(void 0, 
            usuario.grupo.data_confraternizacao,
            "dd 'de' MMMM 'de' yyy",
            {
              locale: _pt2.default,
            }
          ),
          local_confraternizacao: `${usuario.grupo.local_confraternizacao}`,
          valor_minimo: `${usuario.grupo.valor_minimo}`,
        },
      };
      _mail2.default.send(msg);
      // await Mail.sendEmail({
      //   to: `${usuario.usuario.nome} <${usuario.usuario.email}>`,
      //   subject: 'Sorteio Realizado!',
      //   template: 'sorteio',
      //   context: {
      //     usuario: `${usuario.usuario.nome}`,
      //     sorteado: `${usuario.sorteado.nome}`,
      //     nome_grupo: `${usuario.grupo.nome}`,
      //     data_confraternizacao: format(
      //       usuario.grupo.data_confraternizacao,
      //       "dd 'de' MMMM 'de' yyy",
      //       {
      //         locale: pt,
      //       }
      //     ),
      //     local_confraternizacao: `${usuario.grupo.local_confraternizacao}`,
      //     valor_minimo: `${usuario.grupo.valor_minimo}`,
      //   },
      // });
    });

    return res.json({
      mensagem: 'Sorteio Gerado com sucesso',
    });
  }
}

exports. default = new SorteioController();
