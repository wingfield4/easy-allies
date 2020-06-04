'use strict';
const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const Tweet = sequelize.define('Tweet', {
    id: {
      type: Sequelize.INTEGER,
      field: 'id',
      primaryKey: true,
      autoIncrement: true
    },
    tweetId: {
      type: Sequelize.STRING,
      field: 'tweet_id'
    },
    text: {
      type: Sequelize.STRING(400),
      field: 'text'
    },
    userName: {
      type: Sequelize.STRING(400),
      field: 'user_name'
    },
    userScreenName: {
      type: Sequelize.STRING,
      field: 'user_screen_name'
    },
    userProfileImageUrl: {
      type: Sequelize.TEXT,
      field: 'user_profile_image_url'
    },
    retweetCount: {
      type: Sequelize.INTEGER,
      field: 'retweet_count'
    },
    favoriteCount: {
      type: Sequelize.INTEGER,
      field: 'favorite_count'
    },
    retweetText: {
      type: Sequelize.STRING(400),
      field: 'retweet_text'
    },
    retweetUserName: {
      type: Sequelize.STRING(400),
      field: 'retweet_user_name'
    },
    retweetUserScreenName: {
      type: Sequelize.STRING,
      field: 'retweet_user_screen_name'
    },
    retweetUserProfileImageUrl: {
      type: Sequelize.TEXT,
      field: 'retweet_user_profile_image_url'
    },
    createdAt: {
      type: Sequelize.DATE,
      field: 'created_at'
    }
  }, {
    timestamps: false,
    tableName: 'tweet',
    charset: "utf8mb4"
  });
  Tweet.associate = function(models) {
    // associations can be defined here
  };
  return Tweet;
};