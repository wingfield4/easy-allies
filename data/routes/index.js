const Router = require('koa-router');
const router = new Router();

router.get('*', async (ctx) => {
  ctx.body = "Hello Allies!";
})

module.exports = router;
