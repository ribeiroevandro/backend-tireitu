import Notification from '../schemas/notification';

class NotificationController {
  async index(req, res) {
    const notificacoes = await Notification.find({
      usuario: req.usuario_id,
    })
      .sort({ createdAt: 'desc' })
      .limit(10);

    return res.json(notificacoes);
  }
}

export default new NotificationController();
