import Sequelize, { Model } from 'sequelize';

class Lista_presente extends Model {
  static init(sequelize) {
    super.init(
      {
        opcao_1: Sequelize.STRING,
        opcao_2: Sequelize.STRING,
        opcao_3: Sequelize.STRING,
      },
      { sequelize }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Usuario, { foreignKey: 'usuario_id', as: 'usuario' });
  }
}

export default Lista_presente;
