require('dotenv').config();
const Router = require('koa-router');
const router = new Router();
const axios = require('axios');
const querystring = require('querystring');

const { GOOGLE_CALENDAR_API_KEY } = process.env;
const BASE_URL = '/api/v1/calendar';
const BASE_CALENDAR_URL = 'https://www.googleapis.com/calendar/v3';
const CALENDAR_ID = 'tgnt5ne154bpmjcs38js8g3hg72ol9ui%40import.calendar.google.com';

router.get(`${BASE_URL}`, async (ctx) => {
  try {
    let query = querystring.encode({
      key: GOOGLE_CALENDAR_API_KEY
    })

    let res = await axios.get(`${BASE_CALENDAR_URL}/calendars/${CALENDAR_ID}/events?${query}`);

    ctx.body = res.data;
  } catch (err) {
    console.log(err);
  }
})

module.exports = router;
