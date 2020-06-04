'use strict';
const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const Device = sequelize.define('Device', {
    id: {
      type: Sequelize.INTEGER,
      field: 'id',
      primaryKey: true,
      autoIncrement: true
    },
    token: {
      type: Sequelize.TEXT,
      field: 'token'
    },
    twitchEnabled: {
      type: Sequelize.BOOLEAN,
      field: 'twitch_enabled',
      defaultValue: true
    },
    podcastEnabled: {
      type: Sequelize.BOOLEAN,
      field: 'podcast_enabled',
      defaultValue: true
    },
    youtubeEnabled: {
      type: Sequelize.BOOLEAN,
      field: 'youtube_enabled',
      defaultValue: false
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
    tableName: 'device'
  });
  Device.associate = function(models) {
    // associations can be defined here
  };
  return Device;
};