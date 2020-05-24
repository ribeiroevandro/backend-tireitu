module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('grupos', 'participantes', {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 0,
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('grupos', 'participantes');
  },
};
