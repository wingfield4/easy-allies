'use strict';
const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const YoutubePlaylist = sequelize.define('YoutubePlaylist', {
    id: {
      type: Sequelize.TEXT,
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
  }, {
    timestamps: false,
    tableName: 'youtube_playlist'
  });
  YoutubePlaylist.associate = function(models) {
    // associations can be defined here
  };
  return YoutubePlaylist;
};