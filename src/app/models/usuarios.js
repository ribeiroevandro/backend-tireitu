import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

class Usuario extends Model {
  static init(sequelize) {
    super.init(
      {
        nome: Sequelize.STRING,
        email: Sequelize.STRING,
        senha: Sequelize.VIRTUAL,
        senha_hash: Sequelize.STRING,
      },
      { sequelize }
    );

    this.addHook('beforeSave', async user => {
      if (user.senha) {
        user.senha_hash = await bcrypt.hash(user.senha, 8);
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
    return bcrypt.compare(senha, this.senha_hash);
  }
}

export default Usuario;
