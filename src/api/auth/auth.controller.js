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

    // 회원가입 전에 아이디와 이메일 주소 중복 체크 진행
    let existing = null;
    try {
        existing = await Account.findByEmailOrUserName(ctx.request.body);
    } catch (e) {
        ctx.throw(500, e);
    }

    // 중복이 있는 경우
    if (existing) {
        ctx.status = 400; // 400 에러 뱉고
        // 어떤 값이 중복됐는 지 메시지
        ctx.body = {
            key:
                existing.email === ctx.request.body.email
                    ? 'email'
                    : 'userName',
        };
        return;
    }

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
    const schema = Joi.object().keys({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
    });

    const { email, password } = ctx.request.body;

    let account = null;
    try {
        account = await Account.findByEmail(email);
    } catch (e) {
        ctx.throw(500, e);
    }

    if (!account || !account.validatePassword(password)) {
        // 존재하지 않는 사용자 혹은 잘못된 비밀번호의 경우 403
        ctx.status = 403; // forbidden error
        return;
    }

    ctx.body = account.profile;
};

// 이메일 혹은 아이디 존재 여부 확인
exports.exists = async (ctx) => {
    const { key, value } = ctx.params;
    let account = null;

    try {
        // key 에 따라 findByEmail 혹은 findByUsername 실행
        account = await (key === 'email'
            ? Account.findByEmail(value)
            : Account.findByUsername(value));
    } catch (e) {
        ctx.throw(500, e);
    }

    ctx.body = {
        exists: account !== null,
    };
};

// 로그아웃
exports.logout = async (ctx) => {
    ctx.body = 'logout';
};
