const express = require('express');
const routes = express.Router();



const SessionController = require('../app/controllers/SessionController');
const SessionValidator = require('../app/validators/session');
const UserValidator = require('../app/validators/user');
const UserController = require('../app/controllers/UserController');

const {isLoggedRedirectToProfile,onlyUsers,isAdmin} = require('../app/middlewares/session');


//LOGIN LOGOUT

routes.get('/login',isLoggedRedirectToProfile,SessionController.loginForm);
routes.post('/login',SessionValidator.loginUser, SessionController.login);
routes.get('/logout',SessionController.logout);

//USER REGISTER
routes.get('/',isAdmin,UserController.index);
routes.get('/register', onlyUsers,UserController.registerForm);
routes.post('/',isAdmin,UserValidator.post, UserController.post);
routes.put('/',onlyUsers,UserValidator.update,UserController.update);
routes.put('/update',onlyUsers,UserValidator.updateAdmin,UserController.updateAdmin);
//routes.delete('/',UserController.delete); 

//RESET PASSWORD /FORGTxx

routes.get('/forgot-password',SessionController.forgotForm)
routes.get('/password-reset',SessionController.resetForm)
routes.post('/forgot-password', SessionValidator.forgot,SessionController.forgot)
routes.post('/password-reset',SessionValidator.reset, SessionController.reset)

routes.delete('/',isAdmin,UserValidator.remove, UserController.delete);
routes.get('/:id/edit',isAdmin,UserController.edit);



routes.get('/profile',onlyUsers,UserValidator.show,UserController.show);

module.exports = routes;