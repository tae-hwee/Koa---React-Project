/**
 * promise 기반으로 token 생성
 * 추후 JWT 처리하는 미들웨어로 구현
 */
const jwtSecret = process.env.JWT_SECRET;
const jwt = require('jsonwebtoken');

/**
 * JWT 토큰 생성
 * @param {any} payload
 * @returns {string} token
 */
function generateToken(payload) {
    return new Promise((resolve, reject) => {
        jwt.sign(
            payload,
            jwtSecret,
            {
                expiresIn: '7d',
            },
            (error, token) => {
                if (error) {
                    reject(error);
                }
                resolve(token);
            }
        );
    });
}

// 요청이 들어올 때 쿠키에 포함된 access token을 decoding해서 user 식별하는 함수
function decodeToken(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, jwtSecret, (error, decoded) => {
            if (error) {
                reject(error);
            }
            resolve(decoded);
        });
    });
}

/**
 * router handler에서 ctx.request.user를 조회해 user 정보 반환되게 함
 */
exports.jwtMiddleware = async (ctx, next) => {
    const token = ctx.cookies.get('access_token');
    if (!token) {
        return next();
    }

    try {
        const decoded = await decodeToken(token);

        ctx.request.user = decoded; // ctx.request.user에 복호화된 token 넣어주기
    } catch (e) {
        ctx.request.user = null;
    }

    return next();
};

exports.generateToken = generateToken;
