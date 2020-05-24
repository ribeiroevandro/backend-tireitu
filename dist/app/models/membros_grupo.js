"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }Object.defineProperty(exports, "__esModule", {value: true});var _sequelize = require('sequelize'); var _sequelize2 = _interopRequireDefault(_sequelize);

class Membros_grupo extends _sequelize.Model {
  static init(sequelize) {
    super.init(
      {
        moderador: _sequelize2.default.BOOLEAN,
      },
      {
        sequelize,
      }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.Usuario, { foreignKey: 'usuario_id', as: 'usuario' });
    this.belongsTo(models.Usuario, {
      foreignKey: 'sorteado_id',
      as: 'sorteado',
    });
    this.belongsTo(models.Grupo, { foreignKey: 'grupo_id', as: 'grupo' });
  }
}
exports. default = Membros_grupo;
