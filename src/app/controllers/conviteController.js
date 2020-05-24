import sgMail from '@sendgrid/mail';
import * as Yup from 'yup';
import crypto from 'crypto';
import { format } from 'date-fns';
import pt from 'date-fns/locale/pt';

import Contives from '../models/convites';
import Grupos from '../models/grupos';

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
    const grupo = await Grupos.findByPk(req.params.grupo_id);

    const hash = crypto.randomBytes(2);
    const codigo_gerado = hash.toString('hex');

    const novoConvite = await Contives.create({
      usuario_id: req.usuario_id,
      codigo_convite: codigo_gerado,
      grupo_id: grupo.id,
    });

    /** Enviar E-mail */
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
      to: `${convidado.nome} <${convidado.email}>`,
      from: 'TireiTu App <noreply@apptireitu.com.br>',
      templateId: 'd-e2fd20480f184a3491d1b3f3253d5c9c',
      dynamic_template_data: {
        subject: 'Convite para amigo secreto',
        nome: `${convidado.nome}`,
        nome_grupo: `${grupo.nome}`,
        data_confraternizacao: format(
          grupo.data_confraternizacao,
          "dd 'de' MMMM 'de' yyy",
          {
            locale: pt,
          }
        ),
        local_confraternizacao: `${grupo.local_confraternizacao}`,
        valor_minimo: `${grupo.valor_minimo}`,
        data_sorteio: format(grupo.data_sorteio, "dd 'de' MMMM 'de' yyy", {
          locale: pt,
        }),
        codigo_convite: `${novoConvite.id}-${codigo_gerado}-${grupo.id}`,
      },
    };
    sgMail.send(msg);

    return res.json({
      mensagem: 'Convite gerado com sucesso!',
      convidado,
      novoConvite,
    });
  }
}

export default new ConviteController();
