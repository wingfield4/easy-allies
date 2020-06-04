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
      // Create EntryImage Table
      await queryInterface.createTable('youtube_playlist', {
        id: {
          type: Sequelize.STRING(34),
          field: 'id',
          primaryKey: true
        },
        title: {
          type: Sequelize.TEXT,
          field: 'title'
        },
        description: {
          type: Sequelize.TEXT,
          field: 'description'
        },
        channelId: {
          type: Sequelize.TEXT,
          field: 'channel_id'
        },
        thumbnailUrl: {
          type: Sequelize.TEXT,
          field: 'thumbnail_url'
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
      }),
      await queryInterface.createTable('youtube_video', {
        id: {
          type: Sequelize.STRING(11),
          field: 'id',
          primaryKey: true
        },
        title: {
          type: Sequelize.TEXT,
          field: 'title'
        },
        description: {
          type: Sequelize.TEXT,
          field: 'description'
        },
        channelId: {
          type: Sequelize.TEXT,
          field: 'channel_id'
        },
        thumbnailUrl: {
          type: Sequelize.TEXT,
          field: 'thumbnail_url'
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
      }),
      await queryInterface.createTable('youtube_playlist_video', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        playlistId: {
          type: Sequelize.STRING,
          field: 'playlist_id',
          references: {
            model: 'youtube_playlist',
            key: 'id'
          }
        },
        videoId: {
          type: Sequelize.STRING,
          field: 'video_id',
          references: {
            model: 'youtube_video',
            key: 'id'
          }
        },
        position: {
          type: Sequelize.INTEGER,
          field: 'position'
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
    return queryInterface.dropAllTables();
  }
};
