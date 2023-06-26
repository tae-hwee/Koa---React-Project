/**
 * 계정 collection data schema model
 */
const mongoose = require('mongoose');
const { Schema } = mongoose;
const crypto = require('crypto');

function hash(password) {
    return crypto
        .createHmac('sha256', process.env.SECRET_KEY)
        .update(password)
        .digest('hex');
}

const Account = new Schema({
    profile: {
        userName: String,
        thumbnail: {
            type: String,
            default: '/static/imgaes/default_thumbnail.png',
        },
    },
    email: { type: String },
    // 소셜 계정 회원 가입 기능 제공. google과 naver
    social: {
        google: {
            id: String,
            accessToken: String,
        },
        naver: {
            id: String,
            accessToken: String,
        },
    },
    password: String,
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Account', Account);
