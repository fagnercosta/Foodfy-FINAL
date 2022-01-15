const express = require('express');
const routes = express.Router();


const RecipeController = require('../app/controllers/RecipeController');

const HomeController = require('../app/controllers/HomeController');
const {isLoggedRedirectToProfile,onlyUsers,isAdmin,roleRecipeEdit} = require('../app/middlewares/session');
const RecipeValidator = require('../app/validators/recipe');

//Multer
const multer = require('../app/middlewares/multer');
const LIMIT_PHOTOS_CHEF = 1;
const LIMIT_PHOTOS_RECIPE =5;




routes.get('/create',onlyUsers,RecipeController.create);
routes.get('/', onlyUsers,RecipeController.index);
////routes.get('/admin', recipieController.index);
routes.put('/',onlyUsers, roleRecipeEdit, multer.array("photos",LIMIT_PHOTOS_RECIPE),RecipeController.put);
routes.get('/:id',onlyUsers, RecipeController.show);
routes.post('/', RecipeValidator.post,multer.array("photos",LIMIT_PHOTOS_RECIPE),onlyUsers, RecipeController.post);
routes.get('/:id/edit', onlyUsers,RecipeController.edit);
routes.delete('/',onlyUsers, RecipeController.delete);




module.exports = routes;