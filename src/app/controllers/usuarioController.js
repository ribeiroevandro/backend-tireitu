import * as Yup from 'yup';
import Usuarios from '../models/usuarios';
import Arquivos from '../models/arquivos';

class UsuarioController {
  async index(req, res) {
    const usuario = await Usuarios.findByPk(req.usuario_id, {
      attributes: ['id', 'nome', 'email'],
      include: [
        {
          model: Arquivos,
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

    const usuario = await Usuarios.create(req.body);

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

    const usuario = await Usuarios.findByPk(req.usuario_id, {
      attributes: ['id', 'nome', 'email', 'avatar_id'],
      include: [
        {
          model: Arquivos,
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

export default new UsuarioController();
