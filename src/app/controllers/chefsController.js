const Chef = require('../models/Chef');
const File = require('../models/File');
const Recipe = require('../models/Recipie');

module.exports = {

    

    async index(req,res){
        
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
                        img:`${req.protocol}://${req.headers.host}${chef.img.replace("public","")}`        
                    
                }));

                if(chefs.length<1 && filter){
                    return res.render("admin/chefs/index",{
                        chefs,
                        pagination, 
                        filter,
                        information:'Não foi encontrado nenhum chefe com os dados informados!'
                    });
                }
                
                    
                
                
                return res.render("admin/chefs/index",{chefs, pagination, filter});
            }
        };

        Chef.paginate(params);
       } catch (error) {
            return res.render("admin/chefs/index",{chefs, pagination, filter});
       }
    },
    create(req,res){
        return res.render('admin/chefs/create');
    },
    async post(req,res){
        const keys = Object.keys(req.body);
        for(key of keys){
            if(req.body[key]==""){
                return res.send("Por Favor, preencha todos os campos");
            }
        }

        
        //Verificar se usuario enviou imagens
        if(req.files.length==0){
            return res.send(`Please, send at least one image`);
        }
        
        const path = req.files[0].path;
        const filename =  req.files[0].filename;
        const idFile = await File.create({filename,path});
        
        if(idFile){
            req.body.file_id = idFile;
        }


        let results =  await Chef.create(req.body);
        return res.redirect(`/admin/chefs`);
       
    },
    async show(req,res){
        let result = await Chef.findOne(req.params.id); 
        const foundChef = result.rows[0];

        if(!foundChef){
            res.send("Chef Not Found!")
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

            filesRecipe.forEach(f=>console.log("Arquivo Receita..."+f));
            return filesRecipe[0];
        }

        //Para cada receita colocar uma imagem
        const recipesPromise = recipes.map(async recipe => {
            recipe.image = await getFirstFile(recipe.id)
            return recipe
        })

        const recipesList = await Promise.all(recipesPromise);

        
        
      
        return res.render("admin/chefs/show", { chef:foundChef, recipes:recipesList ,files })
           
        
    },
    async put2(req,res){

            let fileID;
        
            let keys = Object.keys(req.body);
            const  id = req.body.id;
            for(key of keys){
                if(req.body[key]=="" && key!="removed_files"){
                    return res.send("Por Favor, preencha todos os campos");
                }
            }

            

    
            
            //Verificar se usuario enviou imagens
            if(req.files.length != 0 && req.body.removed_files){
                const newFilesPromise = req.files.map(file=> File.create({...file}));
                fileID   =  await Promise.all(newFilesPromise);

                console.log("NEW FILE"+fileID);
            
            }


            //Removendo imagens

            if(req.body.removed_files){
                console.log("Tem arquivo removido")
                const removedFiles = req.body.removed_files.split(",");
                const lastIndex = removedFiles.length-1;
                removedFiles.splice(lastIndex,1);

                const removedFilesPromise = removedFiles.map(fileId=> File.delete(fileId));

                await Promise.all(removedFilesPromise);
            }

            

            if(fileID){
                req.body.file_id = fileID[0];
            }else{

                fileChefe = await (await Chef.findOne(id)).rows[0];
                req.body.file_id = fileID;
            }

            let result = await Chef.update(req.body);
           
            return res.redirect(`/admin/chefs/`);
          
        


    },

    async put(req,res){

        let fileID;
    
        let keys = Object.keys(req.body);
        const  id = req.body.id;
        for(key of keys){
            if(req.body[key]=="" && key!="removed_files"){
                return res.send("Por Favor, preencha todos os campos");
            }
        }
        
        //Verificar se usuario enviou imagens
        if(req.files.length != 0 && req.body.removed_files){
            const newFilesPromise = req.files.map(file=> File.create({...file}));
            fileID   =  await Promise.all(newFilesPromise);

            console.log("NEW FILE"+fileID);
        
        }

        //Removendo imagens

        if(req.body.removed_files){
            const removedFiles = req.body.removed_files.split(",");
            const lastIndex = removedFiles.length-1;
            removedFiles.splice(lastIndex,1);

            const removedFilesPromise = removedFiles.map(fileId=> File.delete(fileId));

            await Promise.all(removedFilesPromise);
        }

        let fields = []

        fileID ? (fields = {name:req.body.name,file_id:fileID}): (fields = {name:req.body.name})
        //Atualizar dados do chefe...
        await Chef.update(id,fields);

        let result = await Chef.findFileChefe(req.body.id);
    
        const files = result.rows.map((file)=>({
            ...file,
            src:`${req.protocol}://${req.headers.host}${file.path.replace("public","")}`
        }));
       
        return res.render('admin/chefs/show',{
            success:"Chef atualizado com sucesso!",
            chef:req.body,
            files
        });

    },
    async edit(req,res){
        try {
            const id = req.params.id;
            let result = await Chef.findOne(id);
            const chef = result.rows[0];

            //Obter imagem do chefe
            results = await Chef.findFileChefe(chef.id);
            let files = results.rows;
            files = files.map((file)=>({
                ...file,
                src:`${req.protocol}://${req.headers.host}${file.path.replace("public","")}`
            }));
        
            return res.render("admin/chefs/edit",{chef,file:files[0]});
        } catch (error) {
            console.log("ERROR:"+error);
            return res.render("admin/chefs/edit",{chef,file:files[0]});
        }       
        
        
    },
    async delete(req,res){
       try {
            console.log("Deletar.."+req.body.id);

            let results = await Chef.findRecipies(req.body.id);
            const recipes = results.rows;
            console.log("Quantidade de receitas"+recipes.length);

            if(recipes.length>0){
                const chef = await (await Chef.findChefByID(req.body.id)).rows[0];
                results = await Chef.findFileChefe(chef.id);
        
                const files = results.rows.map((file)=>({
                    ...file,
                    src:`${req.protocol}://${req.headers.host}${file.path.replace("public","")}`
                }));
                return res.render('admin/chefs/show',{
                    chef,files,
                    information:'Não é possível excluir este chefe, pois o mesmo tem receitas vinculdas a ele!'
                })
            }
            
            await Chef.delete(req.body.id);
            
            return res.redirect('/admin/chefs');
       } catch (error) {
           console.error("Erro:"+error);
       }
        
    }
}