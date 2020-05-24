import Sequelize, { Model } from 'sequelize';

class Grupo extends Model {
  static init(sequelize) {
    super.init(
      {
        nome: Sequelize.STRING,
        data_sorteio: Sequelize.DATE,
        data_confraternizacao: Sequelize.DATE,
        local_confraternizacao: Sequelize.STRING,
        hora_confraternizacao: Sequelize.VIRTUAL,
        valor_minimo: Sequelize.DECIMAL,
        status_sorteio: Sequelize.BOOLEAN,
        participantes: Sequelize.INTEGER,
      },
      { sequelize }
    );

    return this;
  }
}

export default Grupo;
