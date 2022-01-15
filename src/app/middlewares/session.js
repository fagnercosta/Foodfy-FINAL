const Recipe = require('../../app/models/Recipie');
const User = require('../../app/models/User');

//Verificar se o usuário esta logado..
//Se náo tiver logado redireciona para a pagina de login
function onlyUsers(req, res, next) {
    
    if(!req.session.userId)
      return res.redirect('/admin/users/login')
    next()
}

function isLoggedRedirectToProfile (req, res, next) {
   
    try {
      if(req.session.userId)
        return res.redirect('/admin/users/profile')
  
      next()
    } catch (error) {
    }
    
}

function isAdmin (req, res, next) {
  
  if(!req.session.isAdmin) {

    console.log("DELETE");
    return res.render("user/profile",{
      user:req.session.user,
      error:"Desculpe! Apenas administradores podem acessar essa funcionalidade."});
  }
  
  next()
}

async function roleRecipeEdit(req,res,next){
    if(!req.session.userId) return redirect('/admin/users/login');

    const result = await Recipe.findOne(req.session.recipeId);
    const recipe = result.rows[0];
    const user = await User.findOne({where:{id:req.session.userId}});
    console.log("USER:"+user.id);
    if( user.is_admin==false  && user.id!=recipe.user_id){
       return res.redirect("/admin/recipes");
    }

    next();

}

 
module.exports = {
    onlyUsers,
    isLoggedRedirectToProfile,
    isAdmin,
    roleRecipeEdit,
    
}