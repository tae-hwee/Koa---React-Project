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

    // 회원가입 완료되면 토큰 발급하고, 이를 쿠키에 저장
    let token = null;
    try {
        token = await account.generateToken();
    } catch (e) {
        ctx.throw(500, e);
    }

    // cookie는 보안 위해 httpOnly로 하고, 유효기간 7일로 설정
    ctx.cookies.set('access_token', token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    });
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

    // 로그인 완료되면 인증 토큰 발급
    let token = null;
    try {
        token = await account.generateToken();
    } catch (e) {
        ctx.throw(500, e);
    }

    ctx.cookies.set('access_token', token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    });
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

// cookie에 access token 정보가 있으면 현재 로그인된 유저 정보를 알려주는 api
exports.check = (ctx) => {
    const { user } = ctx.request;

    if (!user) {
        ctx.status = 403;
        return;
    }

    ctx.body = user.profile;
};

// 로그아웃
exports.logout = async (ctx) => {
    // 쿠키에 저장된 인증 토큰 삭제하는 방식으로 logout 기능 구현
    ctx.cookies.set('access_token', null, { maxAge: 0, httpOnly: true });
    ctx.status = 204;
};
