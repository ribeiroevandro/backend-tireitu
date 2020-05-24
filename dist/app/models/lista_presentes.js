"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }Object.defineProperty(exports, "__esModule", {value: true});var _sequelize = require('sequelize'); var _sequelize2 = _interopRequireDefault(_sequelize);

class Lista_presente extends _sequelize.Model {
  static init(sequelize) {
    super.init(
      {
        opcao_1: _sequelize2.default.STRING,
        opcao_2: _sequelize2.default.STRING,
        opcao_3: _sequelize2.default.STRING,
      },
      { sequelize }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Usuario, { foreignKey: 'usuario_id', as: 'usuario' });
  }
}

exports. default = Lista_presente;
