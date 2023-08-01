# Node.js - React Project
Self-learning Project. (Node.js - React)

* 개발 환경
	- FE: react (17.0.2), javascript
	- BE: koa, javascript
	- 환경 구성:
		- node version: 16.10.0
* 프로젝트 빌드
	- BE: yarn start 후 port 4000
	- FE: recruitement-client 디렉토리에서 yarn start 후 port 3000
* 구현된 기능:
	- 사용자 생성
		- url: localhost:4000/api/auth/register/local
		- request body example (json):
			{
				"userName": "taehwee_park",
				"email": "taehwee_park@gmail.com",
				"password": "abc123"
			}
	- 로그인
		- url: localhost:4000/api/auth/login/local
		- request body example (json):
			{
				"email": "taehwee_park@gmail.com",
				"password": "abc123"
			}
	- 상기 두 기능 FE 환경에서 연동 완료
		- localhost:4000/auth/register
		- localhost:4000/auth/login
