module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('grupos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      nome: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      data_sorteio: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      data_confraternizacao: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      local_confraternizacao: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      valor_minimo: {
        allowNull: false,
        type: Sequelize.DECIMAL(10, 2),
      },
      status_sorteio: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('grupos');
  },
};
