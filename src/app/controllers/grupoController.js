import * as Yup from 'yup';
import Grupos from '../models/grupos';
import Usuarios from '../models/usuarios';
import Membros_grupo from '../models/membros_grupo';

import Notification from '../schemas/notification';

class GrupoController {
  async index(req, res) {
    try {
      const usuario = await Usuarios.findByPk(req.usuario_id);
      if (!usuario) {
        return res.status(404).json({ erro: 'Usuário não localizado!' });
      }

      const grupos_usuario = await Membros_grupo.findAll({
        include: [
          {
            model: Usuarios,
            as: 'usuario',
            attributes: ['id', 'nome'],
          },
          {
            model: Grupos,
            as: 'grupo',
            attributes: ['id', 'nome', 'participantes', 'status_sorteio'],
          },
        ],
        attributes: ['id', 'moderador', 'usuario_id', 'grupo_id'],
        where: { usuario_id: usuario.id },
      });

      return res.json({ grupos_usuario });
    } catch (error) {
      return res.json(error.message);
    }
  }

  async show(req, res) {
    try {
      const usuario = await Usuarios.findByPk(req.usuario_id);
      if (!usuario) {
        return res.status(404).json({ erro: 'Usuário não localizado!' });
      }

      const grupo = await Grupos.findByPk(req.params.grupo_id);
      if (!grupo) {
        return res.status(401).json({ erro: 'Grupo não localizado!' });
      }

      return res.json(grupo);
    } catch (error) {
      return res.json(error.message);
    }
  }

  async store(req, res) {
    /** Validação dos dados entrada */
    const schema = Yup.object().shape({
      nome: Yup.string().required(),
      data_sorteio: Yup.date().required(),
      data_confraternizacao: Yup.date().required(),
      local_confraternizacao: Yup.string().required(),
      hora_confraternizacao: Yup.date().required(),
      valor_minimo: Yup.number().required(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ erro: 'Dados inválidos' });
    }

    const { ...dados } = req.body;

    if (!req.usuario_id) {
      return res.json({ error: 'Sem id de usuário' });
    }

    const novoGrupo = await Grupos.create(dados);

    const membros_grupo = await Membros_grupo.create({
      usuario_id: req.usuario_id,
      grupo_id: novoGrupo.id,
      moderador: true,
    });

    await novoGrupo.update({ participantes: novoGrupo.participantes + 1 });

    return res.json({
      mensagem: 'Grupo criado!',
      novoGrupo,
      membros_grupo,
    });
  }

  async update(req, res) {
    /** Validação dos dados de entrada */
    const schema = Yup.object().shape({
      nome: Yup.string(),
      data_sorteio: Yup.date(),
      data_confraternizacao: Yup.date(),
      local_confraternizacao: Yup.string(),
      valor_minimo: Yup.number(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ erro: 'Dados inválidos' });
    }

    const grupo = await Grupos.findByPk(req.params.grupo_id);
    if (!grupo) {
      return res.status(404).json({ erro: 'Grupo não localizado' });
    }
    grupo.update(req.body);
    grupo.save();

    /** Notificar sobre atualização no grupo */
    const usuarios_grupo = await Membros_grupo.findAll({
      include: [
        {
          model: Usuarios,
          as: 'usuario',
          attributes: ['id', 'nome'],
        },
        {
          model: Grupos,
          as: 'grupo',
          attributes: ['id', 'nome'],
        },
      ],
      attributes: ['id', 'moderador', 'usuario_id', 'grupo_id'],
      where: { grupo_id: req.params.grupo_id, moderador: false },
    });

    usuarios_grupo.forEach(async usuario => {
      await Notification.create({
        mensagem: `ATENÇÃO!!! O moderador atualizou as informações do grupo!`,
        usuario: usuario.usuario_id,
      });
    });

    return res.json({
      mensagem: 'Grupo atualizado com sucesso!',
      grupo,
      usuarios_grupo,
    });
  }

  async delete(req, res) {
    const grupo = await Grupos.findByPk(req.params.grupo_id);
    if (!grupo) {
      return res.status(404).json({ erro: 'Grupo não localizado' });
    }
    grupo.destroy();
    return res.json({ mensagem: 'Grupo deletado com sucesso!' });
  }
}

export default new GrupoController();
