const dataBase = require('../../config/db');
const Recipe = require('../models/Recipie');

module.exports = {

    async all(){
        const query = `SELECT * FROM users`;
        return dataBase.query(query);


    },
    
    async findOne(filters){
        try {
            console.log("Buscanco no Banco...")
            let query = `SELECT * FROM  users`

            Object.keys(filters).map(key=>{

                query = `
                    ${query}
                    ${key}
                
                `

                Object.keys(filters[key]).map(field =>{
                    query = `${query} ${field} = '${filters[key][field]}'`
                });

            });

            console.log("Query:"+query);

            const results = await dataBase.query(query);
            console.log("Resultas ?"+results.rows[0]);

            return results.rows[0];
        } catch (error) {
            console.log(error)
        }

    },

    async update(id, fields){


        try {
            let query = 'UPDATE users SET'

            Object.keys(fields).map((key, index, array)=>{
                if((index+1) <array.length){
                        query = `${query}
                            ${key} = '${fields[key]}',
                        `
                }else{
                //last iteratiom

                query = `${query}
                            ${key} = '${fields[key]}' WHERE id = ${id}
                        `
                }
            });

            console.log(query);

            await dataBase.query(query);
        } catch (error) {
            throw new Error(error);
        }
        

    },

    async create(data){

        const query = `
        INSERT INTO users (
            name,
            email,
            password,
            is_admin 
            
        ) VALUES ($1,$2,$3,$4) RETURNING id
        `;

       
        const values = [
            data.name,
            data.email,
            data.password,
            data.is_admin    
              
        ]

        const results = await dataBase.query(query,values);

        return results.rows[0].id;

    },

    async delete(id){
        try {
            let results = await dataBase.query(`SELECT recipes.* FROM recipes 
            LEFT JOIN users ON (users.id = recipes.user_id)
            WHERE users.id = ${id}`)
            const recipes = results.rows

            console.log("RECIPES:"+recipes.length);

            const filesPromise = recipes.map(recipe =>  Recipe.loadImages(recipe.id));
            let filesResults = await Promise.all(filesPromise)

            await dataBase.query(`DELETE FROM users WHERE id = $1`, [id])

            return filesResults
        } catch (error) {
            console.log(error);
        }
    }

}