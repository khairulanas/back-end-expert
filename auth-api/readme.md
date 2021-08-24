npm install @hapi/hapi @hapi/jwt bcrypt dotenv nanoid pg

npm install @types/jest eslint jest node-pg-migrate nodemon --save-dev

npx eslint --init

psql --username postgres

CREATE DATABASE authapi; CREATE DATABASE authapi_test;

CREATE USER kana WITH ENCRYPTED PASSWORD 'kana';

GRANT ALL PRIVILEGES ON DATABASE authapi, authapi_test TO kana;

psql --username kana --dbname authapi
psql --username kana --dbname authapi_test

npm run migrate create "create table users"
npm run migrate create "create table authentications"

npm run migrate up
npm run migrate:test up