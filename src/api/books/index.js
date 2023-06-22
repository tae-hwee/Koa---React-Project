const Router = require('koa-router');

const books = new Router();

const handler = (ctx, next) => {
    ctx.body = `${ctx.request.method} ${ctx.request.path}`;         // handler 통해 호출하는 REST API Method 종류와 해당 경로 출력되게 함
};

books.get('/', handler);
books.post('/', handler);
books.delete('/', handler);
books.put('/', handler);

module.exports = books;