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
      await queryInterface.createTable('tweet', {
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
    return queryInterface.dropTable('tweet');
  }
};
