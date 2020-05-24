import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

class Convite extends Model {
  static init(sequelize) {
    super.init(
      {
        codigo_convite: Sequelize.STRING,
        status_usado: Sequelize.BOOLEAN,
      },
      {
        sequelize,
      }
    );
    this.addHook('beforeSave', async user => {
      if (user.codigo_convite) {
        user.codigo_convite = await bcrypt.hash(user.codigo_convite, 5);
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
    return bcrypt.compare(codigo, this.codigo_convite);
  }
}
export default Convite;
