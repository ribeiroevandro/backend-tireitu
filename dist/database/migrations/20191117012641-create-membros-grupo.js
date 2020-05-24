"use strict";module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('membros_grupos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      usuario_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'usuarios',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      grupo_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'grupos',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      moderador: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      sorteado_id: {
        type: Sequelize.INTEGER,
        defaultValue: null,
        references: {
          model: 'usuarios',
          key: 'id',
        },
        onDelete: 'SET NULL',
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
    return queryInterface.dropTable('membros_grupos');
  },
};
