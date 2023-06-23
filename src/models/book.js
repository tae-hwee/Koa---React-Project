const mongoose = require('mongoose');
const { Schema } = mongoose;

// Book에서 사용할 sub-document schema (author 항목은 이름과 이메일로 하기 위함)
const Author = new Schema({
    name: String,
    email: String,
});

const Book = new Schema({
    title: String,
    authors: [Author], // 저자가 여러 명일 수 있으므로 위에서 정의한 Author schema의 배열로 정의.
    publishedDate: Date,
    price: Number,
    tags: [String],
    // 이 항목은 default 값을 설정할 것이므로 객체로 정의함
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

/**
 * 상기 schema를 model로 변환해서 export하기 위해 mongoose.model() 사용
 * 첫 번째 parameter: shcema's name
 * 두 번째 parameter: schema object
 * mongodb는 이를 받아들여 자동으로 복수형태의 collection 이름을 생성함 (하기 코드에서는 books가 됨)
 * 만약 mongodb가 복수형태로 collection을 자동 생성하는 것을 막고 원하는 이름을 정하려면 세 번째 parameter로 직접 정의해야 함
 */
module.exports = mongoose.model('Book', Book);
