
const User = require('../models/User');
const {compare} = require('bcryptjs');

function validateFields(body) {
    console.log('Validando campos AQUI....')
    const keys = Object.keys(body);
    for(key of keys){
        console.log("No FOR")
        if(body[key]=="" &&key!="password" )
            
            return {
                user:body,
                error:"Prencha todos os campos!"
            }
        
    }
}

async  function post(req, res, next){

   const validate = validateFields(req.body);
   if(validate){
       console.log("Na Validação FIELDS")
       return res.render('user/create',{...validate});
   }

    //verificar se o usuario ja existe
    let {email} = req.body;


    const userFound = await User.findOne({
        where:{email}
    });

    if(userFound){
        const message = "Usuário já Cadastrado!";
        return res.render("user/create",{
            user:req.body,
            error:message
        });
    }


    next();

}

async function show(req,res,next){
    try {
        const {userId: id} = req.session;
        const user = await User.findOne({
            where:{id}
        });

        if(!user) return res.render("user/create",{
            error:"Usuário não encontgrado"
        });

        req.user = user;

        next();
    } catch (error) {
        console.error("LOG-ERROR="+error);
    }
    
}

async function  update(req,res,next){
    //valida se todos campos estáo preenchidos
   const validate = validateFields(req.body);
   
 
    if(validate){
        const {user, error} = validate;
        return res.render('user/profile',{user, error});
    }

    const {id, password} = req.body;

    if(!password ) return res.render('user/profile',{user:req.body, error:"Coloque sua senha para atualizar seu cadastro!"});

    const userFound = await User.findOne({where:{id}});

    const passwordPassed = await compare(password,userFound.password);

    if(!passwordPassed){
        return res.render('user/profile',{user:req.body, error:"Senha Incorreta. Por favor, tente novamente!"});
    }

    req.user = userFound;

    next();
 
}

async function  updateAdmin(req,res,next){
    //valida se todos campos estáo preenchidos
   const validate = validateFields(req.body);
   
 
    if(validate){
        const {user, error} = validate;
        return res.render('user/profile',{user, error});
    }

    const {id} = req.body;

    //if(!password ) return res.render('user/profile',{user:req.body, error:"Coloque sua senha para atualizar seu cadastro!"});

    const userFound = await User.findOne({where:{id}});

    //const passwordPassed = await compare(password,userFound.password);

    //if(!passwordPassed){
        //return res.render('user/profile',{user:req.body, error:"Senha Incorreta. Por favor, tente novamente!"});
    //}

    req.user = userFound;

    next();
 
}

async function  remove(req,res,next){

    const userId = req.body.id;

    if(userId==req.session.userId){
        return res.render('user/index',{
            users: await (await User.all()).rows,
            error:"Atenção, voçe não pode excluir sua própria conta"
        })
    }

    next();
}

module.exports = {
    post,
    update,
    show,
    remove,updateAdmin
}