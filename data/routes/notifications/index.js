require('dotenv').config();
const Sequelize = require('sequelize');
const Router = require('koa-router');
const router = new Router();
const models = require('../../models');
const querystring = require('querystring');

const BASE_URL = '/api/v1/notifications';

router.post(`${BASE_URL}/registerDevice`, async (ctx) => {
  try {
    const { token } = ctx.request.body;

    await models.Device.findOrCreate({
      where: {
        token
      },
      defaults: {
        token,
        createdAt: new Date()
      }
    });

    ctx.body = "Success";
  } catch (err) {
    console.log(err);
  }
})

router.post(`${BASE_URL}/getDeviceSettings`, async (ctx) => {
  try {
    const { token } = ctx.request.body;

    if(!token) {
      ctx.body = "Invalid Token"
    } else {
      let device = await models.Device.findOne({
        where: {
          token
        }
      });
  
      ctx.body = device;
    }
  } catch (err) {
    console.log(err);
  }
})

router.post(`${BASE_URL}/updateDeviceSettings`, async (ctx) => {
  try {
    const {
      token,
      youtubeEnabled,
      twitchEnabled,
      podcastEnabled
    } = ctx.request.body;

    await models.Device.update({
      youtubeEnabled,
      twitchEnabled,
      podcastEnabled
    }, {
      where: {
        token
      }
    });

    ctx.body = "Success";
  } catch (err) {
    console.log(err);
  }
})

module.exports = router;
