require('dotenv').config();
const sequelize = require('sequelize');
const Router = require('koa-router');
const router = new Router();
const querystring = require('querystring');
const models = require('../../models');

const BASE_URL = '/api/v1/youtube';

router.get(`${BASE_URL}/video/:id`, async (ctx) => {
  try {
    const { id } = ctx.params;

    let video = await models.YoutubeVideo.findOne({
      where: {
        id
      }
    })

    ctx.body = video;
  } catch (err) {
    console.log(err);
  }
})

router.get(`${BASE_URL}/recentUploads`, async (ctx) => {
  try {
    const { limit, offset } = querystring.decode(ctx.querystring);

    let videos = await models.YoutubeVideo.findAndCountAll({
      limit: limit ? parseInt(limit, 10) : 10,
      offset: offset ? parseInt(offset, 10) : 0,
      order: sequelize.literal('published_at DESC')
    })

    ctx.body = videos;
  } catch (err) {
    console.log(err);
  }
})

router.get(`${BASE_URL}/playlists`, async (ctx) => {
  try {
    const { limit, offset, channelId } = querystring.decode(ctx.querystring);

    let playlists = await models.YoutubePlaylist.findAndCountAll({
      limit: limit ? parseInt(limit, 10) : 10,
      offset: offset ? parseInt(offset, 10) : 0,
      where: channelId ? {
        channelId
      } : undefined,
      order: sequelize.literal('published_at DESC')
    })

    ctx.body = playlists;
  } catch (err) {
    console.log(err);
  }
})

router.get(`${BASE_URL}/playlistItems`, async (ctx) => {
  try {
    const { limit, offset, playlistId } = querystring.decode(ctx.querystring);

    let playlistVideos = await models.YoutubePlaylistVideo.findAndCountAll({
      limit: limit ? parseInt(limit, 10) : 10,
      offset: offset ? parseInt(offset, 10) : 0,
      distinct: true,
      subQuery: false,
      include: [
        {
          model: models.YoutubePlaylist,
          as: 'playlist',
          where: {
            id: playlistId,
            deletedAt: null
          }
        },
        {
          model: models.YoutubeVideo,
          as: 'video'
        }
      ],
      order: sequelize.literal('position asc')
    })

    ctx.body = {
      count: playlistVideos.count,
      rows: playlistVideos.rows.map((playlistVideo) => playlistVideo.dataValues.video)
    }
  } catch (err) {
    console.log(err);
  }
})

router.post(`${BASE_URL}/videosById`, async (ctx) => {
  try {
    const { ids = [] } = ctx.request.body;

    console.log('ids', ids);

    let videos = await models.YoutubeVideo.findAll({
      where: {
        id: ids,
        deletedAt: null
      }
    })

    let sortedVideos = [];

    ids.forEach((id) => {
      videos.forEach((video) => {
        if(video.id === id) {
          sortedVideos.push(video);
        }
      })
    })

    ctx.body = sortedVideos;
  } catch (err) {
    console.log(err);
  }
})

module.exports = router;
