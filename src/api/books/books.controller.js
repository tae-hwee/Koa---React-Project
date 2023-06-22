/**
 * books 관련 각 route에 대한 handler를 controller로 분리
 */

// exports.변수명 = ... 형태로 내보낸 코드는 파일을 불러올 때 사용될 수 있음
// 불러오는 요령은 const 모듈명 = require('파일명'); 모듈명.변수명
exports.list = (ctx) => {
    ctx.body = 'listed';
};

exports.create = (ctx) => {
    ctx.body = 'created';
};

exports.delete = (ctx) => {
    ctx.body = 'deleted';
};

exports.replace = (ctx) => {
    ctx.body = 'replaced';
};