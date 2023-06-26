/**
 * 계정 collection data schema model
 */
const mongoose = require('mongoose');
const { Schema } = mongoose;
const crypto = require('crypto');
const { generateToken } = require('lib/token');

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

Account.statics.findByUserName = function (userName) {
    return this.findOne({ 'profile.userName': userName }).exec();
};

Account.statics.findByEmail = function (email) {
    return this.findOne({ email }).exec();
};

Account.statics.findByEmailOrUserName = function ({ userName, email }) {
    return this.findOne({
        $or: [{ 'profile.userName': userName }, { email }],
    }).exec();
};

Account.statics.localRegister = function ({ userName, email, password }) {
    const account = new this({
        profile: {
            userName,
            // thumbnail은 우선 기본값으로 설정되게 함
        },
        email,
        password: hash(password),
    });

    return account.save();
};

Account.methods.validatePassword = function (password) {
    const hashed = hash(password);
    return this.password === hashed;
};

Account.methods.generateToken = function () {
    const payload = {
        _id: this._id,
        profile: this.profile,
    };

    return generateToken(payload, 'account');
};

module.exports = mongoose.model('Account', Account);
