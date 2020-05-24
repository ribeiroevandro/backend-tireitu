"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }Object.defineProperty(exports, "__esModule", {value: true});var _notification = require('../schemas/notification'); var _notification2 = _interopRequireDefault(_notification);

class NotificationController {
  async index(req, res) {
    const notificacoes = await _notification2.default.find({
      usuario: req.usuario_id,
    })
      .sort({ createdAt: 'desc' })
      .limit(10);

    return res.json(notificacoes);
  }
}

exports. default = new NotificationController();
