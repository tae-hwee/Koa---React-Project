const Router = require('koa-router');

const books = new Router();
const booksController = require('./books.controller');

books.get('/', booksController.list);
books.post('/', booksController.create);
books.delete('/', booksController.delete);
books.put('/', booksController.replace);

module.exports = books;