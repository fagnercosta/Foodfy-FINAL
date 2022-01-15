const currentPage = document.location.pathname;

const menuItens = document.querySelectorAll("header .admin-header-container .links a");

for( item of menuItens){
    console.log("Clicou")
    if(currentPage.includes(item.getAttribute("href"))){
        item.classList.add("active");
    }
}