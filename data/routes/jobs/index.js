require('dotenv').config();
const Router = require('koa-router');
const router = new Router();
const models = require('../../models');
const querystring = require('querystring');
const axios = require('axios');
const crypto = require('crypto-js');
const OAuth = require('oauth-1.0a');
const moment = require('moment');
const sendNotification = require('../../notifications/sendNotification');

const { TWITCH_CLIENT_ID, TWITTER_CONSUMER_KEY, TWITTER_CONSUMER_CLIENT, YOUTUBE_API_KEY } = process.env;
const BASE_YOUTUBE_URL = 'https://www.googleapis.com/youtube/v3';
const BASE_TWITCH_URL = 'https://api.twitch.tv/helix';
const BASE_TWITTER_URL = 'https://api.twitter.com/1.1';
const BASE_URL = '/api/v1/jobs';

// router.get(`${BASE_URL}/testToken`, async (ctx) => {
//   try {
//     await sendNotification({
//       message: {
//         title: "Easy Allies Just Went Live!",
//         body: `Streaming Sekiro: Shadow Die Twice on Twitch`
//       } 
//     });

//     ctx.body = {
//       message: 'Success!'
//     }
//   } catch (err) {
//     console.log(err);
//   }
// })

const updatePodcasts = require('./updatePodcasts');
router.get(`${BASE_URL}/updatePodcasts`, updatePodcasts);

router.get(`${BASE_URL}/updateTweets`, async (ctx) => {
  try {
    const getTwitterRequest = (screenName) => {
      let request = {
        url: `${BASE_TWITTER_URL}/statuses/user_timeline.json?screen_name=${screenName}&include_rts=true&exclude_replies=true&count=50`,
        method: 'GET'
      }
    
      const oauth = OAuth({
        consumer: { key: TWITTER_CONSUMER_KEY, secret: TWITTER_CONSUMER_CLIENT},
        signature_method: 'HMAC-SHA1',
        hash_function(base_string, key) {
          return crypto.enc.Base64.stringify(crypto.HmacSHA1(base_string, key));
        }
      });
    
      return axios.get(
        request.url,
        {
          headers: oauth.toHeader(oauth.authorize(request))
        }
      )
    }

    const screenNames = [
      "EasyAllies",
      "MichaelPHuber",
      "bradleyellis87",
      "damianicus",
      "IanHinck",
      "TrailerJones",
      "dbloodworth2",
      "KyleBosman",
      "BenMoore035",
      "thenasacova"
    ];

    for(let i = 0; i < screenNames.length; i++) {
      let res = await getTwitterRequest(screenNames[i]);
      if(res && res.data && res.data.length > 0) {
        for(let j = 0; j < res.data.length; j++) {
          try {
            await models.Tweet.findOrCreate({
              where: {
                tweetId: res.data[j].id_str
              },
              defaults: {
                tweetId: res.data[j].id_str,
                text: res.data[j].text,
                userName: res.data[j].user.name,
                userScreenName: res.data[j].user.screen_name,
                userProfileImageUrl: res.data[j].user.profile_image_url_https,
                retweetCount: res.data[j].retweet_count,
                favoriteCount: res.data[j].favorite_count,
                retweetText: res.data[j].retweeted_status ? res.data[j].retweeted_status.text : null,
                retweetUserName: res.data[j].retweeted_status ? res.data[j].retweeted_status.user.name : null,
                retweetUserScreenName: res.data[j].retweeted_status ? res.data[j].retweeted_status.user.screen_name : null,
                retweetUserProfileImageUrl: res.data[j].retweeted_status ? res.data[j].retweeted_status.user.profile_image_url_https : null,
                createdAt: res.data[j].created_at
              }
            })
          } catch (err) {
            console.log(err);
          }
        }
      }
    }

    ctx.body = {
      message: "Success"
    }

  } catch (err) {
    console.log(err);
  }
})

router.get(`${BASE_URL}/updateTwitchStatus`, async (ctx) => {
  try {
    let oldStatus = await models.TwitchStatus.findOne();

    let res = await axios.get(`${BASE_TWITCH_URL}/streams?user_id=117573174`, {
      headers: {
        'client-id': TWITCH_CLIENT_ID
      }
    });

    let gameRes;
    if(res && res.data && res.data.data && res.data.data.length) {
      gameRes = await axios.get(`${BASE_TWITCH_URL}/games?id=${res.data.data[0].game_id}`, {
        headers: {
          'client-id': TWITCH_CLIENT_ID
        }
      });
    }

    const isOnline = () => {
      return res && res.data && res.data.data && res.data.data.length > 0;
    }

    const hasGame = () => {
      return gameRes && gameRes.data && gameRes.data.data && gameRes.data.data.length > 0;
    }
      

    await models.TwitchStatus.findOne().then(async (status) => {
      if(status) {
        await status.update({
          gameId: isOnline() ? res.data.data[0].game_id : null,
          gameTitle: hasGame() ? gameRes.data.data[0].name : null,
          gameBoxArtUrl: hasGame() ? gameRes.data.data[0].box_art_url : null,
          type: isOnline() ? res.data.data[0].type : null,
          title: isOnline() ? res.data.data[0].title : null,
          viewerCount: isOnline() ? res.data.data[0].viewer_count : null,
          startedAt: isOnline() ? new Date(res.data.data[0].started_at) : null,
          thumbnailUrl: isOnline() ? res.data.data[0].thumbnail_url : null,
          updatedAt: new Date()
        })
      } else {
        await models.TwitchStatus.create({
          gameId: isOnline() ? res.data.data[0].game_id : null,
          gameTitle: hasGame() ? gameRes.data.data[0].name : null,
          gameBoxArtUrl: hasGame() ? gameRes.data.data[0].box_art_url : null,
          type: isOnline() ? res.data.data[0].type : null,
          title: isOnline() ? res.data.data[0].title : null,
          viewerCount: isOnline() ? res.data.data[0].viewer_count : null,
          startedAt: isOnline() ? new Date(res.data.data[0].started_at) : null,
          thumbnailUrl: isOnline() ? res.data.data[0].thumbnail_url : null,
          createdAt: new Date()
        })
      }
    })

    //If Just came online
    if(!oldStatus.get('gameId') && isOnline()) {
      await sendNotification({
        message: {
          title: "Easy Allies Just Went Live!",
          body: `Streaming ${hasGame() ? gameRes.data.data[0].name + ' ' : ''}on Twitch`
        },
        type: 'twitch'
      });
    }

    ctx.body = {
      message: "Success"
    }

  } catch (err) {
    console.log(err);
  }
})

router.get(`${BASE_URL}/getRecentUploads`, async (ctx) => {
  try {

    const getRecentUploads = ({ playlistId }) => {
      return new Promise(async (resolve, reject) => {
        let query = querystring.encode({
          key: YOUTUBE_API_KEY,
          playlistId,
          part: 'snippet, status',
          maxResults: 10
        });

        let res = await axios.get(`${BASE_YOUTUBE_URL}/playlistItems?${query}`).catch((err) => {
          reject(err);
        });

        for(let i = 0; i < res.data.items.length; i++) {
          await models.YoutubeVideo.findOrCreate({
            where: {
              id: res.data.items[i].snippet.resourceId.videoId
            },
            defaults: {
              title: res.data.items[i].snippet.title,
              description: res.data.items[i].snippet.description,
              thumbnailUrl: res.data.items[i].snippet.thumbnails.high.url,
              id: res.data.items[i].snippet.resourceId.videoId,
              channelId: res.data.items[i].snippet.channelId,
              publishedAt: new Date(res.data.items[i].snippet.publishedAt),
              createdAt: new Date()
            }
          }).then(async ([ video, created ]) => {
            if(created) {
              await sendNotification({
                message: {
                  title: "Easy Allies Just Uploaded a New Video!",
                  body: `${video.get('title')}`
                },
                type: 'youtube'
              });
            }
          })
        }
        resolve();
      })
    }

    await getRecentUploads({ playlistId: 'UUZrxXp1reP8E353rZsB3jaA' });
    await getRecentUploads({ playlistId: 'UUL7O6Onu0lBcwZ8t-YMgGcw' });

    ctx.body = {
      message: "Success!"
    }

  } catch (err) {
    console.log(err);
  }
})

router.get(`${BASE_URL}/updatePlaylists/:channelId`, async (ctx) => {
  try {
    const { channelId } = ctx.params;

    if(channelId !== 'UCZrxXp1reP8E353rZsB3jaA' && channelId !== 'UCL7O6Onu0lBcwZ8t-YMgGcw') {
      ctx.body = {
        message: "Invalid channel id"
      }
      return;
    }
    
    let playlists = [];
    let buffer = 0;
    let newPlaylists = 0;

    const getPlaylists = ({ channelId, pageToken }) => {
      return new Promise(async (resolve, reject) => {
        let query = querystring.encode({
          key: YOUTUBE_API_KEY,
          channelId,
          part: 'snippet',
          maxResults: 50,
          pageToken
        });
        
        let res = await axios.get(`${BASE_YOUTUBE_URL}/playlists?${query}`);

        if(res.data && res.data.items) {
          playlists = playlists.concat(res.data.items.map((item) => ({
            title: item.snippet.title,
            description: item.snippet.description,
            thumbnailUrl: item.snippet.thumbnails.standard.url,
            id: item.id,
            channelId: channelId,
            publishedAt: new Date(item.snippet.publishedAt)
          })));
          
          if((playlists.length - buffer < res.data.pageInfo.totalResults) && res.data.nextPageToken) {
            await getPlaylists({ channelId, pageToken: res.data.nextPageToken });
            resolve();
          } else {
            resolve();
          }
        } else {
          reject();
        }
      })
    }

    await getPlaylists({ channelId });

    for(let i = 0; i < playlists.length; i++) {
      await models.YoutubePlaylist.findOne({
        where: {
          id: playlists[i].id
        }
      }).then(async (playlist) => {
        if(playlist) {
          await playlist.update({
            ...playlists[i],
            updatedAt: new Date()
          })
        } else {
          newPlaylists++;
          await models.YoutubePlaylist.create({
            ...playlists[i],
            createdAt: new Date()
          })
        }
      })
    }

    let newVideos = 0;
    let newPlaylistVideos = 0;

    let playlistVideos = []
    const getPlaylistVideos = ({ playlistId, pageToken }) => {
      return new Promise(async (resolve, reject) => {
        let query = querystring.encode({
          key: YOUTUBE_API_KEY,
          playlistId,
          part: 'snippet',
          maxResults: 50,
          pageToken
        });

        let res = await axios.get(`${BASE_YOUTUBE_URL}/playlistItems?${query}`);

        if(res.data && res.data.items) {
          playlistVideos = playlistVideos.concat(res.data.items.map((item) => ({ })));

          for(let i = 0; i < res.data.items.length; i++) {
            //add missing videos
            await models.YoutubeVideo.findOne({
              where: {
                id: res.data.items[i].snippet.resourceId.videoId
              }
            }).then(async (video) => {
              if(video) {
                await video.update({
                  title: res.data.items[i].snippet.title,
                  description: res.data.items[i].snippet.description,
                  thumbnailUrl: res.data.items[i].snippet.thumbnails.high.url,
                  id: res.data.items[i].snippet.resourceId.videoId,
                  channelId: res.data.items[i].snippet.channelId,
                  publishedAt: new Date(res.data.items[i].snippet.publishedAt),
                  updatedAt: new Date()
                })
              } else {
                newVideos++;
                await models.YoutubeVideo.create({
                  title: res.data.items[i].snippet.title,
                  description: res.data.items[i].snippet.description,
                  thumbnailUrl: res.data.items[i].snippet.thumbnails.high.url,
                  id: res.data.items[i].snippet.resourceId.videoId,
                  channelId: res.data.items[i].snippet.channelId,
                  publishedAt: new Date(res.data.items[i].snippet.publishedAt),
                  createdAt: new Date()
                })
                await sendNotification({
                  message: {
                    title: "Easy Allies Just Uploaded a New Video!",
                    body: `${res.data.items[i].snippet.title}`
                  },
                  type: 'youtube'
                });
              }
            });

            //update playlistVideos
            await models.YoutubePlaylistVideo.findOne({
              where: {
                videoId: res.data.items[i].snippet.resourceId.videoId,
                playlistId
              }
            }).then(async (playlistVideo) => {
              if(playlistVideo) {
                await playlistVideo.update({
                  videoId: res.data.items[i].snippet.resourceId.videoId,
                  playlistId,
                  position: res.data.items[i].snippet.position
                })
              } else {
                newPlaylistVideos++;
                await models.YoutubePlaylistVideo.create({
                  videoId: res.data.items[i].snippet.resourceId.videoId,
                  playlistId,
                  position: res.data.items[i].snippet.position
                })
              }
            })
          }
          
          if((playlistVideos.length < res.data.pageInfo.totalResults) && res.data.nextPageToken) {
            await getPlaylistVideos({ playlistId, pageToken: res.data.nextPageToken });
            resolve();
          } else {
            resolve();
          }
        } else {
          resolve();
        }
      })
    }

    for(let i = 0; i < playlists.length; i++) {
      await getPlaylistVideos({ playlistId: playlists[i].id });
      playlistVideos = [];
    }

    ctx.body = {
      addedVideos: newVideos,
      addedPlaylistVideos: newPlaylistVideos
    }

  } catch (err) {
    console.log(err);
  }
})

module.exports = router;
