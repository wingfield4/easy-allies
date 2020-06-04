'use strict';
const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const YoutubePlaylistVideo = sequelize.define('YoutubePlaylistVideo', {
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
  }, {
    timestamps: false,
    tableName: 'youtube_playlist_video'
  });
  YoutubePlaylistVideo.associate = function(models) {
    // associations can be defined here
    YoutubePlaylistVideo.video = YoutubePlaylistVideo.belongsTo(models.YoutubeVideo, {
      as: 'video'
    });
    YoutubePlaylistVideo.playlist = YoutubePlaylistVideo.belongsTo(models.YoutubePlaylist, {
      as: 'playlist'
    });
  };
  return YoutubePlaylistVideo;
};