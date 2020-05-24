"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }Object.defineProperty(exports, "__esModule", {value: true});var _sequelize = require('sequelize'); var _sequelize2 = _interopRequireDefault(_sequelize);
var _bcryptjs = require('bcryptjs'); var _bcryptjs2 = _interopRequireDefault(_bcryptjs);

class Convite extends _sequelize.Model {
  static init(sequelize) {
    super.init(
      {
        codigo_convite: _sequelize2.default.STRING,
        status_usado: _sequelize2.default.BOOLEAN,
      },
      {
        sequelize,
      }
    );
    this.addHook('beforeSave', async user => {
      if (user.codigo_convite) {
        user.codigo_convite = await _bcryptjs2.default.hash(user.codigo_convite, 5);
      }
    });
    return this;
  }

  static associate(models) {
    this.belongsTo(models.Usuario, {
      foreignKey: 'usuario_id',
      as: 'usuario',
    });
    this.belongsTo(models.Grupo, {
      foreignKey: 'grupo_id',
      as: 'grupo',
    });
  }

  checkPassword(codigo) {
    return _bcryptjs2.default.compare(codigo, this.codigo_convite);
  }
}
exports. default = Convite;
