require('dotenv').config();
const Router = require('koa-router');
const router = new Router();
const models = require('../../models');
const axios = require('axios');
const querystring = require('querystring');

const { TWITCH_CLIENT_ID } = process.env;
const BASE_URL = '/api/v1/twitch';
const BASE_TWITCH_URL = 'https://api.twitch.tv/helix';

router.get(`${BASE_URL}`, async (ctx) => {
  try {
    let status = await models.TwitchStatus.findOne();

    ctx.body = status;
  } catch (err) {
    console.log(err);
  }
})

module.exports = router;
