const Koa = require('koa');
const Router = require('koa-router');

const app = new Koa();
const router = new Router();

router.get('/', (ctx, next) => {
    ctx.body = 'Home';
});

router.get('/introduction', (ctx, next) => {        // '/' 외 여러 route를 설정
    ctx.body = 'This is the introduction page';
});

router.get('/introduction/:name', (ctx, next) => {
    const {name} = ctx.params;                      // 라우트 경로에서 :파라미터명 으로 정의된 값이 ctx.parmas에 설정되도록 함
    ctx.body = 'Introduction of ' + name;
});

router.get('/insert', (ctx, next) => {
    const {id} = ctx.request.query;                 // 경로 뒤에 ?id=10 형태로 작성된 uery가 ctx.request.query에 parsing되도록 함
    if (id) {
        ctx.body = 'Posting #' + id;
    }
    else {
        ctx.body = 'Posting ID Not Found';
    }
});

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(4000, () => {
    console.log("THe server is listening to port 4000");
});