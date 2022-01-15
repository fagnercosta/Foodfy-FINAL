
const dataBase = require('../../config/db');

module.exports = {
    async all(){
        try {
            const results = await dataBase.query(`
                SELECT chefs.*, files.path as file
                FROM chefs
                LEFT JOIN files ON (chefs.file_id = files.id)
                ORDER BY updated_at DESC
                `)
      
                return results.rows
          } catch (err) {
            console.error(err)
      
          }
    },
    async create(data){
        
        try {
            const query = `INSERT INTO chefs (
                name,
                file_id 
                ) VALUES ($1,$2) RETURNING id`;
    
            const values = [
                data.name,
                data.file_id
                
            ]
            const results =  await dataBase.query(query, values);
            return results.rows[0].id;
        
        } catch (error) {
            console.log("DEU RUIM"+error)
        }
    },
    findOne(id){
       return dataBase.query(`SELECT chefs.*, count(recipes) AS total_recipes
                                FROM chefs
                                LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
                                WHERE chefs.id = $1
                                GROUP BY chefs.id`, [id] );
    },

    findChefByID(id){
        return dataBase.query(`SELECT * FROM chefs WHERE id=$1`, [id]);
    },

    findFileChefe(id){
        return dataBase.query(`SELECT f.* FROM files f JOIN chefs c ON (f.id=c.file_id) AND c.id= $1; `,[id]);
    },

    findRecipies(id) {
         
        return dataBase.query(`
            SELECT recipes.*
                FROM recipes
                WHERE chef_id = $1`, [id]);
    },


    async update(id,fields){

        /**if(data.file_id){
            try {
                console.log("Foto Recebida:"+data.file_id);
                const query = `
                UPDATE chefs SET  
                    name=($1),
                    file_id =($2) 
                    WHERE id = $3
                `;
    
                const values = [
                    data.name,
                    data.file_id,
                    data.id
                ] 
    
                return dataBase.query(query,values);
            } catch (error) {
                console.error(error);
            }
        }else{
            try {
                console.log("Foto Recebida:"+data.file_id);
                const query = `
                UPDATE chefs SET  
                    name=($1)
                    
                WHERE id = $2
                `;
    
                const values = [
                    data.name,
                    data.id
                ] 
    
                return dataBase.query(query,values);
            } catch (error) {
                console.error(error);
            }
        }**/

        let query = 'UPDATE chefs SET'

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


        
    },
    async selectrecipesById(idChef) {
        try {
            let query = `SELECT recipes.*, chefs.name as chef_name
            FROM recipes
            LEFT JOIN ${this.table} ON (chefs.id = recipes.chef_id)
            WHERE chefs.id = ${id}
            ORDER BY recipes.created_at DESC
            `

            const results = await db.query(query)

            return results.rows
        } catch (err) {
            console.error(err)
        }
    },

    delete(id){
        dataBase.query(`DELETE FROM chefs WHERE id = $1`,[Number(id)],);
    },
    async paginate(params){
        const {filter, limit, offset, callback} = params;

        let query="",
            filterQuery="",
            totalQuery =`(SELECT count(*) FROM chefs) AS total`

       

        if(filter){
            filterQuery = `
                     WHERE chefs.name ILIKE '%${filter}%'`

            totalQuery = `(SELECT count(*) FROM chefs   
                          ${filterQuery}
                          ) AS total`
        }
        query = `
            SELECT DISTINCT chefs.*, ${totalQuery} , count (recipes) AS total_recipes, files.path as img
            FROM chefs 
            LEFT JOIN recipes ON (chefs.id= recipes.chef_id) 
            LEFT JOIN files  ON (files.id=chefs.file_id)
            
            ${filterQuery}
            GROUP BY chefs.id, files.path LIMIT $1 OFFSET $2`

        console.log("Consulta ::"+query);
       
                  
        dataBase.query(query,[limit,offset], function(err,results){
            if(err) throw 'Database error..'+err;
            callback(results.rows);
        });


    },
    paginateAdmin(params){
        const {filter, limit, offset, callback} = params;

        let query="",
            filterQuery="",
            totalQuery =`(SELECT count(*) FROM chefs) AS total`

       

        if(filter){
            filterQuery = `
                     WHERE chefs.name ILIKE '%${filter}%'`

            totalQuery = `(SELECT count(*) FROM chefs   
                          ${filterQuery}
                          ) AS total`
        }
        query = `
            SELECT chefs.*, ${totalQuery} , count (recipes) AS total_recipes
            FROM chefs 
            LEFT JOIN recipes ON (chefs.id= recipes.chef_id) 
            
            ${filterQuery}
            GROUP BY chefs.id LIMIT $1 OFFSET $2`

        console.log("Consulta ::"+query);
       
                  
        dataBase.query(query,[limit,offset], function(err,results){
            if(err) throw 'Database error..'+err;
            callback(results.rows);
        });


    }
    
}

