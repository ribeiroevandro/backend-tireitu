"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }Object.defineProperty(exports, "__esModule", {value: true});var _sequelize = require('sequelize'); var _sequelize2 = _interopRequireDefault(_sequelize);
var _bcryptjs = require('bcryptjs'); var _bcryptjs2 = _interopRequireDefault(_bcryptjs);

class Usuario extends _sequelize.Model {
  static init(sequelize) {
    super.init(
      {
        nome: _sequelize2.default.STRING,
        email: _sequelize2.default.STRING,
        senha: _sequelize2.default.VIRTUAL,
        senha_hash: _sequelize2.default.STRING,
      },
      { sequelize }
    );

    this.addHook('beforeSave', async user => {
      if (user.senha) {
        user.senha_hash = await _bcryptjs2.default.hash(user.senha, 8);
      }
    });
    return this;
  }

  static associate(models) {
    this.belongsToMany(models.Grupo, {
      through: 'membros_grupo',
    });
    this.belongsTo(models.Arquivo, { foreignKey: 'avatar_id', as: 'avatar' });
  }

  checkPassword(senha) {
    return _bcryptjs2.default.compare(senha, this.senha_hash);
  }
}

exports. default = Usuario;
