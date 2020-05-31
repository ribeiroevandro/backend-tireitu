import jwt from 'jsonwebtoken';
import * as Yup from 'yup';
import authConfig from '../../config/auth';
import Usuarios from '../models/usuarios';
import Arquivos from '../models/arquivos';

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

      const usuario = await Usuarios.findOne({
        where: { email },
        include: [
          {
            model: Arquivos,
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
        token: jwt.sign({ id }, authConfig.secret, {
          expiresIn: authConfig.expiresIn,
        }),
      });
    } catch (error) {
      return console.log('error ao tentar criar sessão', error);
    }
  }
}

export default new SessaoController();
