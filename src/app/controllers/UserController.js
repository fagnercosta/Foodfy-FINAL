const { unlinkSync } = require('fs')
const { randomBytes } = require('crypto')
const mailer = require('../../lib/mailer');
const { hash } = require('bcryptjs')

const User = require('../models/User')


module.exports = {
    async index(req,res){

        try {

            let result = await User.all();
            const users = result.rows;

            return res.render('user/index',{users});
        } catch (error) {
            
        }
    },
    async edit(req,res){
       
    try {
        const userId = req.params.id;
        console.log("ID:"+userId);

        const result = await User.findOne({where:{id:userId}});
        const user = result;

        if(!user){
            return res.send("OPSS");
        }

        return res.render('user/edit',{user});
    } catch (error) {
        console.error("ERROR:"+error);
    }

    },
    registerForm(req,res){
        return res.render('user/create');
    },

    async show (req,res){

        try {
            const {user} = req;
            return res.render('user/profile',{user});
        } catch (error) {
            console.error(`ERROR?${error}`);
        }

        
    },
    async post(req,res){

       try {
            //Validações no Validador...

            (!req.body.is_admin) ? req.body.is_admin = false : req.body.is_admin=true;
            let {email, name, is_admin} = req.body;

            console.log("IS ADMIN"+is_admin);


            //Gerar a senha
            const passwordUser = randomBytes(8).toString(`hex`); 
            req.body.password = await hash(passwordUser,8);

            await User.create(req.body);


            //Enviar e-mail com um link de recuperação de senha com nodemailer

            await mailer.sendMail({
                to:email,
                from:'no-relay@launhstore.com.br',
                subject:'Acesso ao Sistema Foodfy',
                html:`Olá, sr (a), ${name}</h2>
                    <p>Usuário: ${email}</p>
                    <p>Senha: ${passwordUser}</p>
                `


            });

           
            return res.render('user/index',{
                users: await (await User.all()).rows,
                success:"Usuário Cadastrado com sucesso!"
            });

       } catch (error) {
           console.log(`ERROR: ${error}`);
       }
        
    },

    async update(req,res){

            //Validade 

            try {
                const userId = req.user.id;
                (!req.body.is_admin) ? req.body.is_admin = false : req.body.is_admin=true;
                let {email, name} = req.body;
               


                await User.update(userId,{name,email});

                return res.render('user/profile',{
                    user:req.body,
                    success:"Conta atualizada com sucesso!"
                });


            } catch (error) {
                console.error(`ERROR:${error}`);
                return res.render('users/profile',{
                    user:req.body,
                    success:"Conta atualizada com sucesso!"
                });

            }
    },

    async updateAdmin(req,res){

        //Validade 

        try {
            const userId = req.user.id;
            (!req.body.is_admin) ? req.body.is_admin = false : req.body.is_admin=true;
            let {email, name, is_admin} = req.body;
            console.log("IS ADMIN"+is_admin);


            await User.update(userId,{name,email, is_admin});

            return res.render('user/index',{
                users:await (await User.all()).rows,
                success:"Conta atualizada com sucesso!"
            });


        } catch (error) {
            console.error(`ERROR:${error}`);
            return res.render('users/profile',{
                user:req.body,
                success:"Conta atualizada com sucesso!"
            });

        }

    },

    async delete(req,res){
        const userId = req.body.id;
    

        try {
            const result = await User.delete(userId);
            if(result){
                result.map(result=>{
                    result.map(async file=>{
                        try {
                            unlinkSync(file.path);
                        } catch (error) {
                            console.error("ERROR:"+error);
                        }
                    });
                });
            }   

            let results = await User.all();
            const users = results.rows;

            return res.render('user/index',{users, success:"Usuário excluído com sucesso!"});
        } catch (error) {
            console.error(error);
            return res.render('user/index',{error:"Erro ao exluir usuário!"});
        }


    }

}