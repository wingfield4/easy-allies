require('dotenv').config();
const Sequelize = require('sequelize');
const Router = require('koa-router');
const router = new Router();
const models = require('../../models');
const querystring = require('querystring');

const BASE_URL = '/api/v1/podcasts';

router.get(`${BASE_URL}/getPodcasts`, async (ctx) => {
  try {
    const { limit, offset } = querystring.decode(ctx.querystring);

    let res = await models.Podcast.findAndCountAll({
      limit: limit ? parseInt(limit, 10) : 100,
      offset: offset ? parseInt(offset, 10) : 0,
      order: Sequelize.literal('title asc')
    });

    ctx.body = res;
  } catch (err) {
    console.log(err);
  }
})

router.get(`${BASE_URL}/getPodcastEpisodes`, async (ctx) => {
  try {
    const { limit, offset, podcastId } = querystring.decode(ctx.querystring);

    let res = await models.PodcastEpisode.findAndCountAll({
      where: {
        podcastId
      },
      limit: limit ? parseInt(limit, 10) : 100,
      offset: offset ? parseInt(offset, 10) : 0,
      order: Sequelize.literal('published_at desc')
    });

    ctx.body = res;
  } catch (err) {
    console.log(err);
  }
})

router.get(`${BASE_URL}/getPodcastEpisode/:id`, async (ctx) => {
  try {
    const { id } = ctx.params;

    let res = await models.PodcastEpisode.findOne({
      where: {
        id
      }
    });

    ctx.body = res;
  } catch (err) {
    console.log(err);
  }
})

router.post(`${BASE_URL}/podcastEpisodesById`, async (ctx) => {
  try {
    const { ids = [] } = ctx.request.body;

    let podcastEpisodes = await models.PodcastEpisode.findAll({
      where: {
        id: ids.map((id) => parseInt(id, 10)),
        deletedAt: null
      }
    })

    let sortedPodcastEpisodes = [];

    ids.forEach((id) => {
      podcastEpisodes.forEach((podcastEpisode) => {
        if(podcastEpisode.id === parseInt(id, 10)) {
          sortedPodcastEpisodes.push(podcastEpisode);
        }
      })
    })

    ctx.body = sortedPodcastEpisodes;
  } catch (err) {
    console.log(err);
  }
})

module.exports = router;
