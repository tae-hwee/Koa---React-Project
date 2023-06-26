const Joi = require('joi');
const ObjectId = require('mongoose').Types.ObjectId;
/**
 * books 관련 각 route에 대한 handler를 controller로 분리
 */
const Book = require('models/book');
// exports.변수명 = ... 형태로 내보낸 코드는 파일을 불러올 때 사용될 수 있음
// 불러오는 요령은 const 모듈명 = require('파일명'); 모듈명.변수명
exports.list = async (ctx) => {
    let books;

    try {
        // .exec() 가 뒤에 붙어야 db에 실제로 요청 전달됨
        books = await Book.find().exec();
    } catch (e) {
        return ctx.throw(500, e);
    }

    ctx.body = books;
};

exports.create = async (ctx) => {
    // request body에서 값들 추출
    const { title, authors, publishedDate, price, tags } = ctx.request.body;

    // Book instance 생성
    const book = new Book({
        title,
        authors,
        publishedDate,
        price,
        tags,
    });

    // .save() 함수 사용하여 db에 실제로 데이터를 작성
    try {
        await book.save();
    } catch (e) {
        return ctx.throw(500, e);
    }

    // 저장한 결과를 반환
    ctx.body = book;
};

exports.getOneBook = async (ctx) => {
    const { id } = ctx.params;

    let book;

    try {
        book = await Book.findById(id).exec();
    } catch (e) {
        return ctx.throw(500, e);
    }

    if (!book) {
        ctx.status = 404;
        ctx.body = { message: 'book not found' };
        return;
    }

    ctx.body = book;
};

exports.delete = async (ctx) => {
    const { id } = ctx.params;

    try {
        await Book.findByIdAndRemove(id).exec();
    } catch (e) {
        if (e.name === 'CastError') {
            ctx.status = 400;
            return;
        }
    }

    ctx.status = 204;
};

exports.replace = async (ctx) => {
    const { id } = ctx.params;

    if (!ObjectId.isValid(id)) {
        ctx.status = 400;
        return;
    }

    const schema = Joi.object().keys({
        title: Joi.string().required(),
        authors: Joi.array().items(
            Joi.object().keys({
                name: Joi.string().required(),
                email: Joi.string().email().required(),
            })
        ),
        publishedDate: Joi.date().required(),
        price: Joi.number().required(),
        tags: Joi.array().items(Joi.string().required()),
    });

    const result = Joi.valid(ctx.request.body, schema.toString());

    if (result.error) {
        ctx.status = 400;
        ctx.body = result.error;
        return;
    }

    let book;

    try {
        book = await Book.findByIdAndUpdate(id, ctx.request.body, {
            upsert: true, // 존재하지 않는 데이터가 request로 들어오면 새로 만들어줄 수 있도록 넣는 statement
            new: true, // 반환하는 값이 update될 수 있도록 넣어주는 statement
        });
    } catch (e) {
        return ctx.throw(500, e);
    }
    ctx.body = book;
};
