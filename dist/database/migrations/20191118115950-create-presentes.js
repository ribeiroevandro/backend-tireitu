"use strict";module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('lista_presentes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      usuario_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'usuarios',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      opcao_1: {
        type: Sequelize.STRING,
      },
      opcao_2: {
        type: Sequelize.STRING,
      },
      opcao_3: {
        type: Sequelize.STRING,
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
  down: queryInterface => {
    return queryInterface.dropTable('lista_presentes');
  },
};
