'use strict';
const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const PodcastEpisode = sequelize.define('PodcastEpisode', {
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
  }, {
    timestamps: false,
    tableName: 'podcast_episode'
  });
  PodcastEpisode.associate = function(models) {
    // associations can be defined here
  };
  return PodcastEpisode;
};