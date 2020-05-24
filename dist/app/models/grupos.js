"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }Object.defineProperty(exports, "__esModule", {value: true});var _sequelize = require('sequelize'); var _sequelize2 = _interopRequireDefault(_sequelize);

class Grupo extends _sequelize.Model {
  static init(sequelize) {
    super.init(
      {
        nome: _sequelize2.default.STRING,
        data_sorteio: _sequelize2.default.DATE,
        data_confraternizacao: _sequelize2.default.DATE,
        local_confraternizacao: _sequelize2.default.STRING,
        hora_confraternizacao: _sequelize2.default.VIRTUAL,
        valor_minimo: _sequelize2.default.DECIMAL,
        status_sorteio: _sequelize2.default.BOOLEAN,
        participantes: _sequelize2.default.INTEGER,
      },
      { sequelize }
    );

    return this;
  }
}

exports. default = Grupo;
