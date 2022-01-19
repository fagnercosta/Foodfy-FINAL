const express = require('express');
const routes = express.Router();

const HomeController = require('../app/controllers/HomeController');
const SessionController = require('../app/controllers/SessionController');
const {isLoggedRedirectToProfile} = require('../app/middlewares/session');


/**===PUBLIC HOME ===**/
routes.get('/chefs', HomeController.allChefs);
routes.get('/chefs/:id', HomeController.showChef);
routes.get("/", HomeController.index);
routes.get('/recipes', HomeController.allRecipes);
routes.get('/recipes/:id', HomeController.showRecipe);
routes.get("/chefs", HomeController.allChefs);
routes.get("/about", (req,res)=>{
    return res.render("home/about");
});


routes.get('/admin',isLoggedRedirectToProfile,SessionController.loginForm);


routes.get('/users/profile', (req,res)=>{
    return res.render("user/profile");
});

routes.get('/teste',(req,res)=>{
    return res.render('messages/error');
})

module.exports =routes;