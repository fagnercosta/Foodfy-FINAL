const express = require("express");
const nunjucks = require("nunjucks");
const routes = require('./routes');
const methodOverride = require('method-override');

//SESSION
const session = require('./config/session');


const server = express();

//Usar a session
server.use(session);

//middleware GLOBAL disponibiliza a sessão em toda apliação...

server.use((req,res,next)=>{
    res.locals.session = req.session;
    next();
});



server.set("view engine", "njk");

nunjucks.configure("src/app/views", {
    express: server,
    autoescape:false,
    noCache: true
});

server.use(methodOverride('_method'));
server.use(express.urlencoded({extended:true}));
server.use(express.static('public'));
server.use(routes);


server.use(function(req, res, next) {
    res.status(404).render('404');
});




server.listen(1000, ()=>{
    console.log("Server is running in port 1000......")
});