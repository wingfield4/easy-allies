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
      // Create Tweet Table
      await queryInterface.createTable('podcast', {
        id: {
          type: Sequelize.INTEGER,
          field: 'id',
          primaryKey: true,
          autoIncrement: true
        },
        title: {
          type: Sequelize.TEXT,
          field: 'title'
        },
        summary: {
          type: Sequelize.TEXT,
          field: 'summary'
        },
        imageUrl: {
          type: Sequelize.TEXT,
          field: 'image_url'
        },
        rssUrl: {
          type: Sequelize.TEXT,
          field: 'rss_url'
        },
        createdAt: {
          type: Sequelize.DATE,
          field: 'created_at'
        },
        updatedAt: {
          type: Sequelize.DATE,
          field: 'updated_at'
        },
        deletedAt: {
          type: Sequelize.DATE,
          field: 'deleted_at'
        }
      }),
      await queryInterface.createTable('podcast_episode', {
        id: {
          type: Sequelize.INTEGER,
          field: 'id',
          primaryKey: true,
          autoIncrement: true
        },
        podcastId: {
          type: Sequelize.INTEGER,
          field: 'podcast_id',
          references: {
            model: 'podcast',
            key: 'id'
          }
        },
        guid: {
          type: Sequelize.TEXT,
          field: 'guid'
        },
        title: {
          type: Sequelize.TEXT,
          field: 'title'
        },
        description: {
          type: Sequelize.TEXT,
          field: 'description'
        },
        length: {
          type: Sequelize.STRING,
          field: 'length'
        },
        mediaUrl: {
          type: Sequelize.TEXT,
          field: 'media_url'
        },
        imageUrl: {
          type: Sequelize.TEXT,
          field: 'image_url'
        },
        publishedAt: {
          type: Sequelize.DATE,
          field: 'published_at'
        },
        createdAt: {
          type: Sequelize.DATE,
          field: 'created_at'
        },
        updatedAt: {
          type: Sequelize.DATE,
          field: 'updated_at'
        },
        deletedAt: {
          type: Sequelize.DATE,
          field: 'deleted_at'
        }
      })
    ]
  },

  down: async (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
   return [
      await queryInterface.dropTable('podcast'),
      await queryInterface.dropTable('podcast_episode')
    ]
  }
};
