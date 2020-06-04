'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    return [
      await queryInterface.addColumn('device', 'twitch_enabled', Sequelize.BOOLEAN, {
        defaultValue: true
      }),
      await queryInterface.addColumn('device', 'podcast_enabled', Sequelize.BOOLEAN, {
        defaultValue: true
      }),
      await queryInterface.addColumn('device', 'youtube_enabled', Sequelize.BOOLEAN, {
        defaultValue: true
      }),
    ]
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
    return [
      queryInterface.removeColumn('device', 'twitch_enabled'),
      queryInterface.removeColumn('device', 'podcast_enabled'),
      queryInterface.removeColumn('device', 'youtube_enabled'),
    ]
  }
};
