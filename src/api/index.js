/**
 * books라는 api 제작
 * module로 만든 후 server entry file인 src/index.js에서 호출해서 사용
 */
const Router = require('koa-router');

const api = new Router();
const books = require('./books'); // src/books/index.js에서 정의한 books라는 api를 /books 경로로 route 연결

api.use('/books', books.routes());

module.exports = api;
