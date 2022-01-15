const Chef = require('../models/Chef');
const File = require('../models/File');
const Recipe = require('../models/Recipie');

module.exports = {

    async index(req,res){
        try {
            
            let result = await Recipe.all();
            const recipes = result.rows;

            async function getFirstFile(recipeId){
                files = await Recipe.loadImages(recipeId);
                files = files.rows;
                files = files.map(file => `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`);

                //Retorna apenas a primeira imagem

                return files[0];
            }

            //Para cada receita colocar uma imagem
            const recipesPromise = recipes.map(async recipe => {
                recipe.image = await getFirstFile(recipe.id)
                return recipe
            }).filter((recipe,index)=> index > 2 ? false :true);

            const recipesList = await Promise.all(recipesPromise);

            if(recipesList.length==0){
                return res.render("home/index", {
                    information:"Não foi encontrado nenhuma receita!"
                });
            }

            return res.render("home/index", {recipies:recipesList});
        } catch (error) {
            console.err("ERROR:"+error);
        }
       
    },
    async allRecipes(req,res){
        try {
            let {filter, page, limit} = req.query;

            page = page || 1;
            limit = limit || 5;
            let offset = limit * (page-1);
            let  total = 0;

            const params = {
                filter,
                page,
                limit,
                offset}

            let results  = await Recipe.paginate(params);
            const recipes = results.rows;
            

            if(recipes.length>0) total = Math.ceil(recipes[0].total/limit)
            
            const pagination = {
                total,
                page

            }

            async function getFirstFile(recipeId){
                files = await Recipe.loadImages(recipeId);
                files = files.rows;
                files = files.map(file => `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`);

                //Retorna apenas a primeira imagem
                return files[0];
            }

            //Para cada receita colocar uma imagem
            const recipesPromise = recipes.map(async recipe => {
                recipe.image = await getFirstFile(recipe.id)
                return recipe
            })

            const recipesList = await Promise.all(recipesPromise);

            if(recipesList.length==0 && filter){
                return res.render("home/recipes", {
                    filter,
                    information:"Não foi encontrado nenhuma receita!"
                });
            }     
            return res.render("home/recipes",{recipes:recipesList, pagination, filter});
        } catch (error) {
            console.err("ERROR:"+error);
            return res.render("home/recipes",{
                error:"Erro ao listar receitas",
                recipes:recipesList, 
                pagination, 
                filter
            });

            
        }

        
        
        
    },
    async showRecipe(req,res){
        try {
            let result = await Recipe.findOne(req.params.id);
            const recipe= result.rows[0];

            //Buscar  Images

            results = await Recipe.loadImages(recipe.id);
            let files = results.rows;
            files = files.map((file)=>({
                ...file,
                src:`${req.protocol}://${req.headers.host}${file.path.replace("public","")}`
            }));
            return res.render(`home/recipe`,{recipe,files});
        } catch (error) {
            console.error(`ERROR: ${error}`);
            return res.render(`home/recipes`,{
                error:"Erro ao carregar Receita. Por Favor, tente novamente"
            });
        }
    },

    async allChefs(req,res){
        try {
            let {filter, page, limit} = req.query;

            page = page || 1;
            limit = limit || 5;
            let offset = limit * (page-1);
            let  total = 0;

            const params = {
                filter,
                page,
                limit,
                offset,
                callback(chefs){
                    if(chefs.length>0){
                        total = Math.ceil(chefs[0].total/limit)
                    }
                    const pagination = {
                        filter,
                        total,
                        page

                    }
                
                    
                    chefs = chefs.map((chef)=>({
                            ...chef,
                            src:`${req.protocol}://${req.headers.host}${chef.img.replace("public","")}`        
                        
                    }));
                    
                    // Se o sistema náo encontrar nenhum chef cadastrado, ou se o resultado da busca for zero. O sistema emite um aviso ao usuário. 
                    // Náo encontrar chefs na busca ou se náo tiver chefs cadastrados na base NÂO é um erro.  
                    if(chefs.length==0){
                            return res.render("home/chefs",{
                                information:"Não foi encontrado nenhum chefe!",
                                chefs, pagination, filter
                            }
                        );
                    }
                    
                    return res.render("home/chefs",{chefs, pagination, filter});
                }
            };

            Chef.paginate(params);
        } catch (error) {
            console.error("Erro ao carregar chefs!");
            return res.render("home/chefs",{
                    error:"Erro ao carregar chefs!"
                }
            );
        }
    },

    async showChef(req,res){
       try {
                let result = await Chef.findOne(req.params.id); 
                const foundChef = result.rows[0];

                if(!foundChef){
                    return res.render("home/chefs", { 
                        error:"Opss! Chef não encontrado!"
                   });
                }

                result = await Chef.findFileChefe(foundChef.id);
            
                const files = result.rows.map((file)=>({
                    ...file,
                    src:`${req.protocol}://${req.headers.host}${file.path.replace("public","")}`
                }));

            

                result = await Chef.findRecipies(foundChef.id);
                let recipes = result.rows;

                async function getFirstFile(recipeId){
                    filesRecipe = await Recipe.loadImages(recipeId);
                    filesRecipe = filesRecipe.rows;
                    filesRecipe = filesRecipe.map(file => `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`);

                    //Retorna apenas a primeira imagem
                    return filesRecipe[0];
                }

                //Para cada receita colocar uma imagem
                const recipesPromise = recipes.map(async recipe => {
                    recipe.image = await getFirstFile(recipe.id)
                    return recipe
                })

                const recipesList = await Promise.all(recipesPromise);
                
                return res.render("home/chef", { chef:foundChef, recipes:recipesList ,files });
       } catch (err) {
           
           return res.render('home/chefs',{
                erro:'Erro ao realizar a operação. Tente Novamente!'
            });
       }
           
        
    }
}