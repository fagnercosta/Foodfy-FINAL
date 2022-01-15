const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);


const dataBase = require('./db');

module.exports = session({
    store: new pgSession({
        pool:dataBase
    }),
    secret: '!Gown2550',
    resave: false,
    saveUninitialized:false,
    cookie:{
        maxAge: 30 * 24 * 60 * 60 * 1000
    }
});