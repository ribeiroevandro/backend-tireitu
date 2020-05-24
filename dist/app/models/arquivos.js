"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }Object.defineProperty(exports, "__esModule", {value: true});var _sequelize = require('sequelize'); var _sequelize2 = _interopRequireDefault(_sequelize);

class Arquivo extends _sequelize.Model {
  static init(sequelize) {
    super.init(
      {
        nome: _sequelize2.default.STRING,
        arquivo: _sequelize2.default.STRING,
        url: {
          type: _sequelize2.default.VIRTUAL,
          get() {
            return `${process.env.APP_URL}/files/${this.arquivo}`;
          },
        },
      },
      {
        sequelize,
      }
    );
    return this;
  }
}
exports. default = Arquivo;
