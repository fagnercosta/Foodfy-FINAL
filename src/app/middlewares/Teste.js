const {hash} = require(`bcryptjs`);



        async function gerarSenha(){
                //ENCRIPTAR SENHA
        // senha, forca, promisse
            const  passwordHash = await hash('12345', 8);

            console.log('Senha:'+passwordHash);
        }

        gerarSenha();

