const Recipe = require('../models/Recipie');
const {compare} = require('bcryptjs');

function validateFields(body) {
    const keys = Object.keys(body);
    for(key of keys){
        
        if(body[key]=="" && key!="is_admin")
            
            return {
                user:body,
                error:"Prencha todos os campos da receita!"
            }
        
    }
}

async function post(req,res,next){
    
    validate = validateFields(req.body);

    if(validate){
        return res.render('recipe/create',{...validate});
    }

    

    next();
}

module.exports = {
    post
}