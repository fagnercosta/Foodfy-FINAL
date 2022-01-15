const express = require('express');
const routes = express.Router();
//const HomeController = require('../app/controllers/HomeController');
//const SessionController = require('../app/controllers/SessionController');


const recipes = require('./recipes');
const home = require('./home');
const users = require('./users');

const chefs = require('./chefs');

routes.use('/admin/users',users);
routes.use('/admin/recipes',recipes);
routes.use('/admin/chefs', chefs);
routes.use('/',home);






/***
 * 
 * 
 * Rotas a serem apagadas
 */






module.exports = routes;



