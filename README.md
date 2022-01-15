
<h1 align="center">
<img src="https://github.com/fagnercosta/Foodfy-FINAL/blob/main/public/img/chef.png?raw=true"/>
  

Desáfio Final Launchbase - Rocketseat
</h1>


<p> Foodfy é um site de receitas desenvolvido com as tecnologias:

- [Node.js](https://nodejs.org/en/) 
- [PostgreSQL](https://www.postgresql.org/)
- [Nunjucks](https://mozilla.github.io/nunjucks/)
- [Faker.js](https://github.com/marak/Faker.js/)
- [Mailtrap](https://mailtrap.io)
   
  
<p>  </h2>Como usar ?</h2>
   

 <h4> Para executar o projeto voçe precisa das seguinte ferramentas instaladas:</h4>
 <p> <a href="https://nodejs.org/en/"> Node.js+NPM</a> </p>
 <p></hr> <a href="https://www.postgresql.org/download/"> PostgreSQL</a> </p>
 <p><a href="https://www.electronjs.org/apps/postbird"> Postbird ou <a href="https://www.pgadmin.org/"> pgAdmin</p>


<h3> Passos </h3>

1. Clonar este repositório

  ```bash
  git clone https://github.com/fagnercosta/Foodfy-FINAL.git
 ```

2. Instalar as depenencias [Entre a pasta raiz do projeto] e execute o comando

 ```bash
 npm install -y
  ```


3. Configurar o banco de dados

  ```bash
  psql -U <username> -c "CREATE DATABASE foodfy"

  ```
  
  Este passo, pode ser realizado também diretamente com as ferramentas Postbird ou pgAdmin. 
  ```bash
  Importante
  Para criar as tabelas no banco, execute no servidor de banco de dados os scripts disponíveis no arquivo  /database.sql. 
  Leia as instruções contidas no arquivo.
  ```

4. Credenciais de acesso ao banco
  
  ```bash
  Importante
  Entre no diretorío /src/config/ e altere o arquivo db.js com as suas credenciais
  ```
  
  ```bash
    const {Pool} = require('pg');

    module.exports = new Pool({
        user:'USER
        password:'PASSWORD'
        host:'HOST'
        port:PORT
        database:'foodfy'
});
  ```

5. Após criar o banco e configurar o arquivo (db.js), execute o arquivo  seed.js. Isto irá fazer uma carga inial de dados Ficticios no sistema.
  ```bash
  node .\seed.js
 ```
  
  6. Inicie o servidor.


  
  7. Acessando o sistema no navegador
  
  ```bash
  http://localhost:1000
  ```
  
 <h1 align="center">
  Resultado
 <h1 align="center">
    <img src="https://github.com/fagnercosta/Foodfy-FINAL/blob/main/public/img/HomePage.png?raw=true"/>
</h1>

<h2>Acessando a área adminstrativa</h2>
<p>  
     Para acessar a área adminstrativa, consulte na tabela users no banco de dados os usuários criado. O login do usuário é o e-mail e a senha padrão é '12345'
   
</p>
   
<h1 align="center">
   Serviço de E-mail
</h1>
<p>
   Para usar o serviço de e-mail do MAILTRAP para recuperação de senha e criação de usuários, edite o arquivo /src/lib/mailer.js colocando as suas credencias.
  
   <p> <a href="https://mailtrap.io/"> Mailtrap</a> </p>
  
   ```bash
      const nodemailer = require('nodemailer');


      module.exports =  nodemailer.createTransport({
          host: "smtp.mailtrap.io",
          port: 2525,
          auth: {
            user: "YOU USER",
            pass: "YOU PASSWORD"
          }
      });
  ```
  
</p>
  
  
  
  
  

   
   
