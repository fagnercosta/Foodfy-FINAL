//Gerar TOKEN com cripto
const crypto = require('crypto');
const mailer = require('../../lib/mailer');
const {hash} = require('bcryptjs');
const User = require('../models/User');

module.exports = {

    loginForm(req,res){
        try {
            return res.render("session/login")
        } catch (err) {
            console.error(err)
            return res.redirect("/")
        }
    },

    login(req, res){
        try {
            req.session.userId = req.user.id;
            req.session.isAdmin = req.user.is_admin
        
           
            return res.render('user/profile',{
                user:req.user,
                success:`Login realizado com sucesso. Bem vindo, ${req.user.name}`
            });
        } catch (error) {
            console.error('Error:'+error);
        }
    },
    logout(req,res){
        req.session.destroy();
        return res.redirect("/");
    },

    forgotForm(req,res){
        return res.render("session/forgot-password");
    },
    async forgot(req,res){

        try {
                const user = req.user;
                //criar um token para usuario

                const token = crypto.randomBytes(20).toString("hex");

                //Criar uma expiração para o token

                let now = new Date();
                //1 (Uma Hora)
                now = now.setHours(now.getHours()+1);

                await User.update(user.id,{
                    reset_token: token,
                    reset_token_expires:now
                });

                //Enviar e-mail com um link de recuperação de senha com nodemailer

                await mailer.sendMail({
                    to:user.email,
                    from:'no-relay@launhstore.com.br',
                    subject:'Recuperação de Senha',
                    html:`<h2>Perdeu a senha?</h2>
                        <p>Náo se preocupe, clique no link abaixo para recuperar sua senha</p>

                        <p>
                            <a href="http://localhost:3000/admin/users/password-reset?token=${token}">RECUPERAR SENHA</a>
                        </p>
                    `


                });


                //Avisar usuário

                return res.render('session/forgot-password',{
                    success:"Verifique seu e-mail para resetar sua senha"
                })
        } catch (error) {
            console.log(error);
            
            return res.render('session/forgot-password',{
                error:'Erro ao realizar a operação. Tente Novamente!'
            })
        }
    },

    async resetForm(req,res){
        
        const token =  req.query.token;

        return res.render('session/password-reset',{token});
    },

    async reset(req,res){
        const {email, token, password, passwordRepeat} = req.body;

        try {
            const user = req.user;

            //Criar nova senha
            const newPassword = await hash(password,8);

            //Atualiza o usuario
            
            await  User.update(user.id,{
                password: newPassword,
                reset_token:"",
                reset_token_expires:""

            })
            //Alerta o usuario

            return res.render("session/login",{
                user:req.body,
                success:"Senha atualizada. Faça o seu login"
            });



            
        } catch (error) {
            console.log(error);
            return res.render('session/password-reset',{
                user:req.body,
                token,
                error:'Erro ao realizar a operação. Tente Novamente!'
            })
        }
    }

   


    


}