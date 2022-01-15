const {
    hash
  } = require('bcryptjs')
  
  const faker = require('faker');
  
  const User = require('./src/app/models/User');
  const Chef = require('./src/app/models/Chef');
  const Recipe = require('./src/app/models/Recipie');
  const File = require('./src/app/models/File');

  const {recipes: data } = require('./data.json')

  let chefsIds = []
  let usersIds = []
 
  let totalUsers = 5
  let totalChefs = 5
  
 
  
  async function createUsers() {
    const users = []
    const password = await hash('12345', 8)
    console.log("Criando usuários..............");
    while (users.length < totalUsers) {
      
      users.push({
          name: faker.name.firstName(),
          email: faker.internet.email(),
          password,
          is_admin: Math.round(Math.random()),
      })
      
    }
  
    const usersPromise = users.map(user => User.create(user))
    usersIds = await Promise.all(usersPromise)
  }

  async function createChef(chef, file){

     const filename = file.name;
     const path = file.path;
     chef.file_id = await File.create({...file});
     const chefId = await Chef.create(chef);
     chefsIds.push(chefId);
     console.log("ID CHEFE:"+chefId);
     return chefId;
  }


  async function populateChefs() {
    console.log("Criando chefs...")
    let  count = 0
    while (count < totalChefs) {
        const name = "chef-default.jpg";
        const path = "/public/images/chef-default.jpg";
        
        const file = {
            filename: `${Date.now().toString()}-${name}`,
            path
        }
        
        const chef = { name:faker.name.findName()}

        const chefId = await createChef(chef, file)
        chefsIds.push(chefId)

        count++
    }
}


async function createRecipe(recipe, file) {
  const recipeId = await Recipe.create(recipe)
  
  const fileId = await File.create({...file})
  await Recipe.recipeFileCreate({recipeCreateId:recipeId,file:fileId});

  return recipeId
}


async function populateRecipes() {
  console.log("Criando receitas....")

  chefsIds.forEach((e)=>{console.log(e)})
  let count = 0
  while (count < data.length) {
      const { title, path, ingredients, preparation, information } = data[count]
      
      const recipe = {
          title, 
          chef: chefsIds[Math.floor(Math.random() * chefsIds.length)] || 1,
          user_id: usersIds[Math.floor(Math.random() * usersIds.length)] || 1, 
          ingredients, 
          preparation, 
          information
      }

      const file = {
          filename: `${Date.now().toString()}-${path.replace('/public/images','')}`,
          path
      }
      
      await createRecipe(recipe, file)

      count++
  }
}
  
 
  
  async function init() {
    await createUsers();
    await populateChefs();
    await populateRecipes();


    console.log("Processo finalizado com sucesso.")
    
   
  }
  
  init()