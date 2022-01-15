const {compare} = require('bcryptjs');
const User = require('../models/User');


 function validateFields(body) {
    console.log("Entrou na Validação...")
    const keys = Object.keys(body);
    for(key of keys){
        if(body[key]=="")
            
            return {
                user:body,
                error:"Opss! Usuário ou senha não informados! Por Favor tente novamente!"
            }
        
    }
}

async function loginUser(req,res,next){
    
    

    const validate = validateFields(req.body);

    if(validate){
        const {user, error} = validate;
        return res.render('session/login',{error});
    }

    const {email, password} = req.body;

    const user = await User.findOne({
        where:{email}
    });

    if(!user) return res.render("session/login",{
        user:null,
        error:"Opps! Usuário não encontrado"
    });

    const passed = await compare(password, user.password);

    if(!passed){                                 
        return res.render('session/login',{
            user:req.body,
            error:"Opss! Senha incorreta!"
        })
    }

    req.user = user;




    next();
}


async function forgot(req,res,next){
    const {email } = req.body;

    if(!email){
        return res.render("session/forgot-password",{
            user:null,
            error:"Informe o e-mail cadastrado para realizar a operação!"
        });
    }

    try {
        let user = await User.findOne({
            where: {email}
        });

        if(!user) return res.render("session/forgot-password",{
            user:null,
            error:"E-mail não cadastrado"
        });

        req.user = user;

        next();
    } catch (error) {
        console.error(error);
    }

    
}

async function reset(req,res,next){

    const validate = validateFields(req.body);
   

    if(validate){

    
       return res.render('session/password-reset',{
           user:req.body,
           token:req.body.token,
           error:"Preencha todos os campos para realizar a operação"});
    }
   

    //Estrategia 

    //Procurar usuario

    const {email, password,passwordRepeat, token} = req.body;
    const user = await User.findOne({
        where:{email}
    });

    if(!user) return res.render("session/password-reset",{
        user:req.body,
        token,
        error:"Usuário não encontrado"
    });

    //Senhas is MACTH

    if(password !=passwordRepeat){
        const message = "As senhas não conferem!";
        return res.render("session/password-reset",{
            user:req.body,
            token,
            error:message
        });
        
    }

    //Token Existe ?
    

    if(token!= user.reset_token){
        return res.render("session/password-reset",{
            user:null,
            token,
            error:'Token Inválido. Solicite uma nova recuperação de Senha!'
        });
    }

    //Token náo expirou ?

    let now = new Date();
    now = now.setHours(now.getHours());

    if(now > user.reset_token_expires){
        return res.render("session/password-reset",{
            user:null,
            token,
            error:'Token Expirado. Solicite uma nova recuperação de Senha!'
        });
    }

    req.user = user;
    next();

}



module.exports = {
    loginUser,forgot,reset
}