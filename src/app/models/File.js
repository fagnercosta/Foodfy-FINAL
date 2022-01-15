const dataBase = require('../../config/db');
const fs = require('fs');

module.exports = {
     async create({filename,path}){
       
       try {
            const query = `INSERT INTO files (
                name,
                path
        
            ) VALUES($1,$2) RETURNING id`;

            const values = [
                filename,
                path
            ];

            const results =  await dataBase.query(query, values);
            return results.rows[0].id;
            
       } catch (error) {
           console.log("Erro ao Salvar Arquivo..."+error);
       }

       


    },
    
    findOne(id){
        return dataBase.query(`SELECT * FROM files WHERE id = $1`,[id]);
    },

    async delete(id){

        try {
             //Deletar o arquivo do Disco
            const result = await dataBase.query(`SELECT * FROM files WHERE id = $1`,[id]);
            const file = result.rows[0];
            
            //Deletar Imagens Tabela File
            await dataBase.query(`DELETE FROM files WHERE id = $1`,[id]);

            fs.unlinkSync(file.filename);
        } catch (error) {
            console.log(error);
        }
        
    },
    async deleteRecipeFiles(id){
        console.log("ID a ser apagado do Banco:"+id);
        try {
            //Deletar o arquivo do Disco
            const result = await dataBase.query(`SELECT * FROM files WHERE id = $1`,[id]);
            const file = result.rows[0];
           

            //Deletar linha tabela recipe_files

            await dataBase.query(`DELETE FROM recipe_files WHERE file_id = $1`,[id]);
            console.log("Apagou do banco...");

            //Deletar Imagens Tabela Files
            await dataBase.query(`DELETE FROM files WHERE id = $1`,[id]);

            fs.unlinkSync(file.filename);

             
        } catch (error) {
            console.log("Erro ao Deletar imagens"+error);
        }
    }
}