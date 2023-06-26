require('dotenv').config();

const Koa = require('koa');
const Router = require('koa-router');

const app = new Koa();
const router = new Router();
const api = require('./api');

const port = process.env.PORT || 4000; // .env에서 port 번호 받아오고, PORT가 설정되지 않은 경우 4000 사용

const mongoose = require('mongoose');
const bodyParser = require('koa-bodyparser');

mongoose.Promise = global.Promise; // Node의 native Promise 사용 -> 동기
// mongodb connection
mongoose
    .connect(process.env.MONGO_URI, {})
    .then((response) => {
        console.log('Successfully connected to mongodb');
    })
    .catch((e) => {
        console.error(e);
    });

router.get('/', (ctx, next) => {
    ctx.body = 'Home';
});

app.use(bodyParser()); // body parser 적용

router.get('/introduction', (ctx, next) => {
    // '/' 외 여러 route를 설정
    ctx.body = 'This is the introduction page';
});

router.get('/introduction/:name', (ctx, next) => {
    const { name } = ctx.params; // 라우트 경로에서 :파라미터명 으로 정의된 값이 ctx.parmas에 설정되도록 함
    ctx.body = 'Introduction of ' + name;
});

router.get('/insert', (ctx, next) => {
    const { id } = ctx.request.query; // 경로 뒤에 ?id=10 형태로 작성된 uery가 ctx.request.query에 parsing되도록 함
    if (id) {
        ctx.body = 'Posting #' + id;
    } else {
        ctx.body = 'Posting ID Not Found';
    }
});

router.use('/api', api.routes()); // api route를 /api 경로 하위 route로 설정

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(port, () => {
    console.log('THe server is listening to port ' + port);
});
