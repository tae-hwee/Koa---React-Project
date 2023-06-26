/**
 * 인증/인가 중 인증에 관련된 route에서 쓰일 controller 함수들 선언
 */
const Joi = require('joi');
const Account = require('models/account');

// local 회원 가입
exports.localRegister = async (ctx) => {
    const schema = Joi.object().keys({
        userName: Joi.string().alphanum().min(4).max(15).required(),
        email: Joi.string().email().required(),
        password: Joi.string().required().min(6),
    });

    let account = null;
    try {
        account = await Account.localRegister(ctx.request.body);
    } catch (e) {
        ctx.throw(500, e);
    }

    ctx.body = account.profile;
};

// local 로그인
exports.localLogin = async (ctx) => {
    ctx.body = 'login';
};

// 이메일 혹은 아이디 존재 여부 확인
exports.exists = async (ctx) => {
    ctx.body = 'exists';
};

// 로그아웃
exports.logout = async (ctx) => {
    ctx.body = 'logout';
};
