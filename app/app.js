import Koa from 'koa';
import path from 'path';
import logger from 'koa-logger';
import convert from 'koa-convert';
import bodyParser from 'koa-bodyparser';
import onerror from 'koa-onerror';
import csrf from 'koa-csrf';
import json from 'koa-json';
import session from 'koa-session';
import config from 'config';
import http from 'http';
import nunjucks from 'nunjucks';
import views from 'koa-views';
import {assetsPath} from './middlewares/assets_helper';
import router from './routes/index';

const appKey = config.get('appKey');
const port = config.get('port');
const app = new Koa();
app.keys = [appKey];

// error handle
onerror(app);
// bodyparser
app.use(bodyParser());
// json parse
app.use(convert(json()));
// logger
app.use(convert(logger()));
// session
app.use(convert(session(app)));
// csrf
app.use(new csrf());
// helper func
app.use(async (ctx, next) => {
  ctx.state = {
    csrf: ctx.csrf,
    assetsPath
  };
  await next();
});
// 配置nunjucks模板文件所在的路径，否则模板继承时无法使用相对路径
nunjucks.configure(path.join(__dirname, './templates'), { autoescape: true });
// frontend static file
app.use(convert(require('koa-static')(path.join(__dirname, '../public'))));
//views with nunjucks
app.use(views(path.join(__dirname, './templates'), {
  map: {
    html: 'nunjucks'
  }
}));
// router
app.use(router.routes(), router.allowedMethods());
// error
app.on('error', function(err, ctx){
  console.log(err);
  logger.error('server error', err, ctx);
});

app.listen(process.env.PORT || port);

export default app;
