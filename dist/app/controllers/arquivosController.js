"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }Object.defineProperty(exports, "__esModule", {value: true});var _arquivos = require('../models/arquivos'); var _arquivos2 = _interopRequireDefault(_arquivos);

class ArquivosController {
  async store(req, res) {
    const { originalname: nome, filename: arquivo } = req.file;

    const file = await _arquivos2.default.create({
      nome,
      arquivo,
    });

    return res.json(file);
  }
}
exports. default = new ArquivosController();
