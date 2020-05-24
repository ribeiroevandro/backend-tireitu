import * as Yup from 'yup';
import Lista_presentes from '../models/lista_presentes';
import Usuarios from '../models/usuarios';

class Lista_presentesController {
  async index(req, res) {
    const lista_desejo = await Lista_presentes.findOne({
      where: { usuario_id: req.usuario_id },
      attributes: ['id', 'opcao_1', 'opcao_2', 'opcao_3'],
    });
    return res.json(lista_desejo);
  }

  async show(req, res) {
    const usuario_lista_desejo = await Lista_presentes.findOne({
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

    const usuario = await Usuarios.findByPk(req.usuario_id);
    if (!usuario) {
      return res.status(404).json({ erro: 'Usuário não localizado!' });
    }

    const { opcao_1, opcao_2, opcao_3 } = await Lista_presentes.create({
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

    const lista_presente = await Lista_presentes.findByPk(
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

export default new Lista_presentesController();
