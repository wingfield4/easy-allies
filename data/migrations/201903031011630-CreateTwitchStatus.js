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
      // Create TwitchStatus Table
      await queryInterface.createTable('twitch_status', {
        id: {
          type: Sequelize.INTEGER,
          field: 'id',
          primaryKey: true,
          autoIncrement: true
        },
        gameId: {
          type: Sequelize.INTEGER,
          field: 'game_id'
        },
        gameTitle: {
          type: Sequelize.TEXT,
          field: 'game_title'
        },
        gameBoxArtUrl: {
          type: Sequelize.TEXT,
          field: 'game_box_art_url'
        },
        type: {
          type: Sequelize.STRING,
          field: 'type'
        },
        title: {
          type: Sequelize.TEXT,
          field: 'title'
        },
        viewerCount: {
          type: Sequelize.INTEGER,
          field: 'viewer_count'
        },
        startedAt: {
          type: Sequelize.DATE,
          field: 'started_at'
        },
        thumbnailUrl: {
          type: Sequelize.TEXT,
          field: 'thumbnail_url'
        },
        createdAt: {
          type: Sequelize.DATE,
          field: 'created_at'
        },
        updatedAt: {
          type: Sequelize.DATE,
          field: 'updated_at'
        }
      })
    ]
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
    return queryInterface.dropTable('twitch_status');
  }
};
