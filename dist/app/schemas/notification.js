"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }Object.defineProperty(exports, "__esModule", {value: true});var _mongoose = require('mongoose'); var _mongoose2 = _interopRequireDefault(_mongoose);

const NotificationSchema = new _mongoose2.default.Schema(
  {
    mensagem: {
      type: String,
      required: true,
    },
    usuario: {
      type: Number,
      required: true,
    },
    status_lido: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
);

exports. default = _mongoose2.default.model('Notification', NotificationSchema);
