'use strict';
const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const Podcast = sequelize.define('Podcast', {
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
  }, {
    timestamps: false,
    tableName: 'podcast'
  });
  Podcast.associate = function(models) {
    // associations can be defined here
  };
  return Podcast;
};