const ingredients = document.querySelector("#ingredients");
const fieldIngredient = document.querySelectorAll(".ingredient");

const preparations = document.querySelector("#preparations");
const fieldPreparation =document.querySelectorAll(".preparation");

const btnAddIngredient = document.querySelector(".add-ingredient");
const btnAddPreparation = document.querySelector(".add-preparation");

function addItem(item, field) {
    // Realiza um clone do último item adicionado
    const newField = field[field.length - 1].cloneNode(true);
  
    // Não adiciona um novo input se o último tem um valor vazio
    if (newField.children[0].value == ""){
        return false;
    } 
  
    // Deixa o valor do input vazio
    newField.children[0].value = "";
    // adicionando um novo input para a estrutura do Ingrediente ou Preparo
    item.appendChild(newField);
}
  
btnAddIngredient.addEventListener("click", ()=>{addItem(ingredients, fieldIngredient)});
btnAddPreparation.addEventListener("click", ()=>{addItem(preparations, fieldPreparation)});
