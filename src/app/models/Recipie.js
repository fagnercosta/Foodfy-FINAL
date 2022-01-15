const dataBase = require('../../config/db');
const fs = require('fs');
const Recipie = require('../models/Recipie');

const File = require('../models/File');

module.exports = {

    

    async all(){
        const query= `SELECT r.*, c.name AS chef_name  FROM recipes r
                      LEFT JOIN chefs c ON (r.chef_id=c.id)`;
        return dataBase.query(query);
                
       
    },

    

    async create(data){
       
        const query = `INSERT INTO recipes (
            title,
            user_id,
            chef_id,
            ingredients,
            preparation,
            information
            
        ) VALUES($1,$2,$3,$4,$5,$6) RETURNING id`;

        const values =[
            data.title,
            data.user_id,
            data.chef ,
            data.ingredients,
            data.preparation,
            data.information
            
        ];

        const results =  await dataBase.query(query, values);
           
        return results.rows[0].id;
    },

    findOne(id){

        console.log("ID RECEBIDO:"+id);
        return dataBase.query(`
            SELECT r.*, c.name AS author,c.id AS idChef FROM recipes r 
            JOIN chefs c ON r.chef_id = c.id
            AND  r.id= $1`,[id]);
    },
    update(data){
        const query = `
        UPDATE recipes SET
            
            title=($1),
            chef_id=($2),
            ingredients=($3),
            preparation=($4)
            WHERE id = $5
        `;

        const values = [
            
            data.title,
            data.chef,
            data.ingredients,
            data.preparation,
            data.id
        ]

        return dataBase.query(query,values);
    },

    async delete(id){

        dataBase.query(`DELETE FROM recipes WHERE id = $1`,[Number(id)],);
    },

    recipeFileCreate({recipeCreateId,file}){
        try {
            return dataBase.query(`
                INSERT INTO recipe_files (
                    recipe_id,
                    file_id
                ) VALUES ($1, $2)
                RETURNING id
            `, [recipeCreateId, file]);
        } catch (err) {
            console.error(err)
        }
    },

    paginate(params){
        const {filter, limit, offset} = params;

        let query="",
            filterQuery="",
            totalQuery =`(SELECT count(*) FROM recipes) AS total`

       

        if(filter){
            filterQuery = `
                     WHERE recipes.title ILIKE '%${filter}%'`

            totalQuery = `(SELECT count(*) FROM recipes   
                          ${filterQuery}
                          ) AS total`
        }
        query = `
            SELECT recipes.*, ${totalQuery},chefs.name AS chef_name 
            FROM recipes
            LEFT JOIN chefs ON(recipes.chef_id = chefs.id) 
            ${filterQuery} LIMIT $1 OFFSET $2`

        console.log("Consulta ::"+query);
       
        const results = dataBase.query(query,[limit,offset]);
               
        return  results; 

    },

    chefsSelectOptions(){
        try {
            return  dataBase.query(`SELECT c.id, c.name FROM chefs c`);
        } catch (error) {
            console.error(error);
        }
        
    },
    loadImages(idRecipe){
        return dataBase.query(`SELECT f.* FROM files f
        JOIN recipe_files rf ON rf.recipe_id = $1 AND rf.file_id = f.id`,[idRecipe]) ;
    }
}