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

exports.generateToken = generateToken;
