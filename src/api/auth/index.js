/**
 * 인증 관련 controller 함수들 API 테스트를 위해 임시로 문자열 설정
 */

const Router = require('koa-router');
const auth = new Router();
const authCtrl = require('./auth.controller');

auth.post('/register/local', authCtrl.localRegister);
auth.post('/login/local', authCtrl.localLogin);
auth.get('/exists/:key(email|username)/:value', authCtrl.exists);
auth.get('/check', authCtrl.check);
auth.post('/logout', authCtrl.logout);

module.exports = auth;
