require('dotenv').config();

//create koa app
const Koa = require('koa');
const app = new Koa();

//allow cors
const cors = require('koa2-cors');
app.use(cors({
  origin: (ctx) => {
    return ctx.request.header.origin;
  },
  credentials: true
}));

//use bodyParser
const koaBody = require('koa-body');
app.use(koaBody({
  multipart: true,
  formLimit: 15,
  formidable: {
    uploadDir: `${__dirname}/temp`,
    keepExtensions: true
  }
}));

//define routes
const indexRoutes = require('./routes');
const youtubeRoutes = require('./routes/youtube');
const twitterRoutes = require('./routes/twitter');
const calendarRoutes = require('./routes/calendar');
const twitchRoutes = require('./routes/twitch');
const jobRoutes = require('./routes/jobs');
const notificationsRoutes = require('./routes/notifications');
const podcastsRoutes = require('./routes/podcasts');

//api endpoints
app.use(youtubeRoutes.routes());
app.use(twitterRoutes.routes());
app.use(calendarRoutes.routes());
app.use(twitchRoutes.routes());
app.use(jobRoutes.routes());
app.use(notificationsRoutes.routes());
app.use(podcastsRoutes.routes());

//catches all other routes.
app.use(indexRoutes.routes());

//db connect and app start
var db = require('./db');
const PORT = process.env.PORT || 3001;
module.exports = new Promise((resolve, reject) => {
  db.sync().then(() => {
    resolve(app.listen(PORT, () => {
      console.log(`App running on port ${PORT}`)
    }));
  });
});
