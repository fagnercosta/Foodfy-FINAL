const fs = require('fs');
const Recipie = require('../models/Recipie');

const File = require('../models/File');



module.exports = {

   

    async index(req,res){
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

        let results  = await Recipie.paginate(params);
        const recipes = results.rows;
        

        if(recipes.length>0) total = Math.ceil(recipes[0].total/limit)
        
        const pagination = {
            total,
            page

        }

        async function getFirstFile(recipeId){
            files = await Recipie.loadImages(recipeId);
            files = files.rows;
            files = files.map(file => `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`);

            //Retorna apenas a primeira imagem

            files.forEach(f=>console.log("Arquivo Receita..."+f));
            return files[0];
        }

        //Para cada receita colocar uma imagem
        const recipesPromise = recipes.map(async recipe => {
            recipe.image = await getFirstFile(recipe.id)
            return recipe
        })

        const recipesList = await Promise.all(recipesPromise);
        


        return res.render("admin/recipe/index",{recipes:recipesList, pagination, filter});

        
        
        
    },
    async create(req,res){

        const teste = req.session.teste;
        console.log("TESTE:"+teste);

        const result = await Recipie.chefsSelectOptions();
        let chefsOptions= result.rows;
        
        return res.render("admin/recipe/create",{chefsOptions});
           
            
    },
    async post(req,res){

       try{
            
            if(req.files.length<1){
                return res.render('recipe/create',{error:"Para cadastrar uma receita é necessário colocar pelo menos uma imagem"});
            }

            const filesPromise = req.files.map(file => File.create({...file}));
            let filesCreated = await Promise.all(filesPromise);
            
            const userID = req.session.userId;
            req.body.user_id =  userID;
            let recipeCreateId = await Recipie.create(req.body);
            console.log("Receita Criada:"+recipeCreateId);
           
            //Apos obter o ID da Receira Cria, popular Tabela ReciceFiles

            const recipeFilePromise = filesCreated.map(file=> Recipie.recipeFileCreate({recipeCreateId,file}));
            await Promise.all(recipeFilePromise);

            return res.redirect(`/admin/recipes/`);

       } catch (err) {
            console.log("Erro:"+err);
            return res.redirect(`/admin/recipes/`,{
                recipe:req.body,
                files:req.files,
                error:"Erro ao cadastrar receita. Por favor tente novamente!"
            });
       }
        
    },
    async show(req,res){
        let result = await Recipie.findOne(req.params.id);
        const recipe= result.rows[0];
        req.session.recipeId = recipe.id;

        //Buscar  Images

        results = await Recipie.loadImages(recipe.id);
        let files = results.rows;
        files = files.map((file)=>({
            ...file,
            src:`${req.protocol}://${req.headers.host}${file.path.replace("public","")}`
        }));
        return res.render(`admin/recipe/show`,{recipe,files});
       
    },
    async edit(req,res){

        //Pegar od id da Recpeita
        const idRecipe = req.params.id;
        
        let result = await Recipie.findOne(idRecipe);
        const recipe = result.rows[0];
             
        result = await Recipie.chefsSelectOptions();
        const chefsOptions = result.rows;

        //Buscar  Images

        results = await Recipie.loadImages(idRecipe);
        let files = results.rows;
        files = files.map((file)=>({
            ...file,
            src:`${req.protocol}://${req.headers.host}${file.path.replace("public","")}`
        }));
        
                
        return res.render("admin/recipe/edit",{recipe,chefsOptions,files });
             
    },
    async delete(req,res){
        try {
            const {id} = req.body;

            //Buscar  Images
            let results = await Recipie.all();
            const recipes = results.rows;

            let promisseAllFiles = recipes.map(recipe => Recipie.loadImages(recipe.id));
            let promisseResults = await Promise.all(promisseAllFiles);
            //Remover Receita do Banco
            
            Recipie.delete(req.body.id);
            
            promisseResults.map(result=>{
                result.rows.map(file=>{
                    try {
                        fs.unlinkSync(file.path);
                    } catch (error) {
                        
                    }
                });
            });

            return  res.render('messages/success');
            
            

        } catch (error) {
            console.error(error);
            return  res.render('messages/error');
        }
    },
    async put(req,res){
        try {
            const keys = Object.keys(req.body);
            const  id = req.body.id;
            for(key of keys){
                if(req.body[key]=="" && key!="removed_files"){
                    return res.send("Por Favor, preencha todos os campos");
                }
            }

            let filesCreated = [];
            //Verificar se usuario enviou imagens, ou se as imagens são as mesmas que ja estavam no registro....
            if(req.files.length!=0){
                const newFilesPromise = req.files.map(file=> File.create({...file}));
                filesCreated   =  await Promise.all(newFilesPromise);
                
            }

            //Removendo imagens

            if(req.body.removed_files){
                const removedFiles = req.body.removed_files.split(",");
                const lastIndex = removedFiles.length-1;
                removedFiles.splice(lastIndex,1);

                const removedFilesPromise = removedFiles.map(fileId=> File.deleteRecipeFiles(fileId));
                await Promise.all(removedFilesPromise);
            }

            if(filesCreated.length!=0){
                //Apos obter o ID da Receita Atualizada, popular Tabela ReciceFiles
                const recipeCreateId = req.body.id;
                const recipeFilePromise = filesCreated.map(file=> Recipie.recipeFileCreate({recipeCreateId,file}));
                await Promise.all(recipeFilePromise);
            }

            await Recipie.update(req.body);

            return res.redirect(`/admin/recipes/`);
        } catch (error) {
            console.log("ERRO:"+error);
        }
            


    }
}

