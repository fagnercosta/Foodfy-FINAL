const express = require('express');
const routes = express.Router();



const chefsController = require('../app/controllers/chefsController');
const {isLoggedRedirectToProfile,onlyUsers,isAdmin} = require('../app/middlewares/session');

//Multer
const multer = require('../app/middlewares/multer');
const LIMIT_PHOTOS_CHEF = 1;
const LIMIT_PHOTOS_RECIPE =5;





/** == CHEFSS ADMIN ===*/
routes.get('/create',isAdmin,chefsController.create);
routes.get('/',onlyUsers,chefsController.index);

routes.get('/:id', chefsController.show);
routes.get('/:id/edit',chefsController.edit);
routes.post('/', multer.array("photos",LIMIT_PHOTOS_CHEF),chefsController.post);
routes.put('/', multer.array("photos",LIMIT_PHOTOS_CHEF),chefsController.put);
routes.delete('/',chefsController.delete);

module.exports = routes;
