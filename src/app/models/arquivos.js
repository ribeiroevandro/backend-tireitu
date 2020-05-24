import Sequelize, { Model } from 'sequelize';

class Arquivo extends Model {
  static init(sequelize) {
    super.init(
      {
        nome: Sequelize.STRING,
        arquivo: Sequelize.STRING,
        url: {
          type: Sequelize.VIRTUAL,
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
export default Arquivo;
