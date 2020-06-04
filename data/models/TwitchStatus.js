'use strict';
const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const TwitchStatus = sequelize.define('TwitchStatus', {
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
  }, {
    timestamps: false,
    tableName: 'twitch_status'
  });
  TwitchStatus.associate = function(models) {
    // associations can be defined here
  };
  return TwitchStatus;
};