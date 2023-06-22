/**
 * books라는 api 제작
 * module로 만든 후 server entry file인 src/index.js에서 호출해서 사용
 */
const Router = require('koa-router');

const api = new Router();

api.get('/books', (ctx, next) => {
    ctx.body = 'GET ' + ctx.request.path;
});

module.exports = api;