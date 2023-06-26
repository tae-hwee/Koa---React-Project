const Router = require('koa-router');

const books = new Router();
const booksController = require('./books.controller');

books.get('/', booksController.list);
books.get('/:id', booksController.getOneBook);
books.post('/', booksController.create);
books.delete('/:id', booksController.delete);
books.put('/:id', booksController.replace);

module.exports = books;
