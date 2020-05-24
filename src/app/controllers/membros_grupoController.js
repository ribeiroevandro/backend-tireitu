import * as Yup from 'yup';
import Grupos from '../models/grupos';
import Usuarios from '../models/usuarios';
import Membros_grupo from '../models/membros_grupo';
import Convites from '../models/convites';
import Arquivos from '../models/arquivos';

import Notification from '../schemas/notification';

class Membros_grupoController {
  async index(req, res) {
    const grupo = req.params.grupo_id;

    const usuarios_grupo = await Membros_grupo.findAll({
      include: [
        {
          model: Usuarios,
          as: 'usuario',
          attributes: ['id', 'nome', 'email'],
          include: [
            {
              model: Arquivos,
              as: 'avatar',
              attributes: ['id', 'nome', 'url'],
            },
          ],
        },
        {
          model: Grupos,
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

    const usuario = await Usuarios.findByPk(req.params.convidado_id);
    if (!usuario) {
      return res.json({ error: 'Usuário não cadastrado' });
    }

    /** Verificação de código de convite */
    const { codigo_convite } = req.body;
    const [convite_id, token, grupo] = codigo_convite.split('-');

    const busca_convite = await Convites.findByPk(convite_id);

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
    const checkGrupo = await Membros_grupo.findAll({
      where: { usuario_id: usuario.id, grupo_id: busca_convite.grupo_id },
    });
    if (checkGrupo.length >= 1) {
      return res.status(401).json({ erro: 'Usuário já pertence ao grupo' });
    }

    /** Entrada do usuario no grupo */
    const entrar_grupo = await Membros_grupo.create({
      usuario_id: usuario.id,
      grupo_id: busca_convite.grupo_id,
    });

    const buscaGrupo = await Grupos.findByPk(busca_convite.grupo_id);

    await buscaGrupo.update({ participantes: buscaGrupo.participantes + 1 });

    /** Notificar sobre a entrada no grupo */
    const participantes = await Membros_grupo.findAll({
      include: [
        {
          model: Usuarios,
          as: 'usuario',
          attributes: ['id', 'nome'],
        },
      ],
      attributes: ['id', 'moderador', 'usuario_id', 'grupo_id', 'sorteado_id'],
      where: { grupo_id: busca_convite.grupo_id },
    });

    participantes.forEach(async membro => {
      await Notification.create({
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

export default new Membros_grupoController();
