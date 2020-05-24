import Sequelize, { Model } from 'sequelize';

class Membros_grupo extends Model {
  static init(sequelize) {
    super.init(
      {
        moderador: Sequelize.BOOLEAN,
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
export default Membros_grupo;
