require('dotenv').config();
const Sequelize = require('sequelize');
const Router = require('koa-router');
const router = new Router();
const models = require('../../models');
const querystring = require('querystring');

const BASE_URL = '/api/v1/twitter';

router.get(`${BASE_URL}/statuses`, async (ctx) => {
  try {
    const { limit, offset } = querystring.decode(ctx.querystring);

    let res = await models.Tweet.findAndCountAll({
      limit: limit ? parseInt(limit, 10) : 100,
      offset: offset ? parseInt(offset, 10) : 0,
      order: Sequelize.literal('created_at desc')
    });

    ctx.body = res;
  } catch (err) {
    console.log(err);
  }
})

module.exports = router;
