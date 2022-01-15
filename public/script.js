const cards = document.querySelectorAll(".card");
const cards_chefs = document.querySelectorAll(".card-admin");
const NOT_RSULST_SEARCH ="Não foram encontrados resultados para a busca....";


for (let card of cards){
    card.addEventListener("click",function(){
        const recipesID = card.getAttribute("id");
        const PATH = `/recipes/${recipesID}`;
        window.location.href = PATH;
        
    });
    
}

for (let card of cards_chefs){
    card.addEventListener("click",function(){
        const chefsID = card.getAttribute("id");
        const PATH = `/chefs/${chefsID}`;
        window.location.href = PATH;
        
    });
    
}

//** == MOSTRAR RECEITA */

const LIMIT_UPLOAD_RECIPE = 5;
const LIMIT_UPLOAD_CHEFE = 1;
const buttons = document.querySelectorAll(".btn-toogle");
const containerIngredients = document.querySelector(".recipie-ingredients");

for(let butaoShow of buttons){
    butaoShow.addEventListener("click", ()=>{
        console.log("Clicando...")
    });
}

const PhotosUpload = {
    uploadLimit: LIMIT_UPLOAD_RECIPE,
    input: "",
    files: [],
    preview: document.querySelector('#photos-preview'),
    apply(func, params) {
        if (func.includes('Chef')) PhotosUpload.uploadLimit = LIMIT_UPLOAD_CHEFE

        if (PhotosUpload.uploadLimit > 1) {
            PhotosUpload.preview.style.gridTemplateColumns = "repeat(5, 1fr)"
            PhotosUpload.preview.style.width = "80%"
        }

        PhotosUpload[func](params)
    },
    handleFileUploadChef(event) {
        const { files: fileList } = event.target
        PhotosUpload.input = event.target

        if (PhotosUpload.hasLimit(event)) {
            PhotosUpload.updateInputFiles()
            return
        }

        Array.from(fileList).forEach(file => {
            PhotosUpload.files.push(file)

            const reader = new FileReader()
            reader.onload = () => {
                const image = new Image()
                image.src = String(reader.result)

                const div = PhotosUpload.getContainer(image)

                PhotosUpload.preview.appendChild(div)
            }

            reader.readAsDataURL(file)
        })

        PhotosUpload.updateInputFiles()
    },
    hasLimit(event) {
        const { input, preview, uploadLimit } = PhotosUpload
        const { files: fileList } = input

        if (fileList.length > PhotosUpload.uploadLimit) {
            (uploadLimit > 1) ? alert(`Envie no máximo ${PhotosUpload.uploadLimit} fotos!`) : alert(`Envie no máximo ${PhotosUpload.uploadLimit} foto!`)
            event.preventDefault()
            return true
        }

        const photosDiv = []
        preview.childNodes.forEach(item => {
            if (item.classList && item.classList.value == 'photo')
                photosDiv.push(item)
        })

        const totalPhotos = fileList.length + photosDiv.length

        if (totalPhotos > uploadLimit) {
            (uploadLimit > 1) ? alert(`Envie no máximo ${PhotosUpload.uploadLimit} fotos!`) : alert(`Envie no máximo ${PhotosUpload.uploadLimit} foto!`)
            event.preventDefault()
            return true
        }

        return false
    },
    getContainer(image) {
        const div = document.createElement('div')
        div.classList.add('photo')
        div.appendChild(image)
        div.appendChild(PhotosUpload.getRemoveButton())

        return div
    },
    getRemoveButton() {
        const button = document.createElement('i')
        button.classList.add('material-icons')
        button.onclick = PhotosUpload.removePhoto
        button.innerHTML = 'close'

        return button
    },
    getAllFiles() {
        const datatransfer = new DataTransfer() || new ClipboardEvent("").clipboardData

        PhotosUpload.files.forEach(file => datatransfer.items.add(file))

        return datatransfer.files
    },
    updateInputFiles() {
        PhotosUpload.input.files = PhotosUpload.getAllFiles()
    },
    removePhoto(event) {
        const photoDiv = event.target.parentNode
        const newFiles = Array.from(PhotosUpload.preview.children).filter(file => {
            if (file.classList.contains('photo') && !file.getAttribute('id')) return true
        })

        const index = newFiles.indexOf(photoDiv)
        PhotosUpload.files.splice(index, 1)
        PhotosUpload.updateInputFiles()

        photoDiv.remove()
    },
    removePreviousPhoto(event) {
        const photoDiv = event.target.parentNode

        if (photoDiv.id) {
            const removedFiles = document.querySelector('input[name="removed_files"]')
            if (removedFiles) {
                removedFiles.value += `${photoDiv.id},`
            }
        }

        photoDiv.remove()
    },
    handleFileInputRecipes(event) {
        const { files: fileList } = event.target
        PhotosUpload.input = event.target

        if (PhotosUpload.hasLimit(event)) {
            PhotosUpload.updateInputFiles()
            return
        }

        Array.from(fileList).forEach(file => {
            PhotosUpload.files.push(file)

            const reader = new FileReader()
            reader.onload = () => {
                const image = new Image()
                image.src = String(reader.result)

                const div = PhotosUpload.getContainer(image)

                PhotosUpload.preview.appendChild(div)

            }

            reader.readAsDataURL(file)
        })

        PhotosUpload.updateInputFiles()
    }
}

/*** === IMAGE GALLERY === ***/

const ImageGallery = {
    highlight : document.querySelector('.photos-recipes .highlight > img'),

    previews : document.querySelectorAll('.photos-recipes-gallery img'),

    setImage(event){
        const {target} = event;
        const path = target.src;
        /** Tirando classe active de todas a imagens */
        ImageGallery.previews.forEach(preview => preview.classList.remove('active'));
        target.classList.add('active');

        /** Trocando Imagem */
        ImageGallery.highlight.src = path;
        


    }
}

// ** == PAGINATION ** //

function paginate(selectedPage, totalPages){

    if(totalPages>0){
        let oldPage;

        let pages = [];

        for(let currentPage =1; currentPage<= totalPages;currentPage++){
            
            const firstAndLastPAge = currentPage==1 || currentPage==totalPages;
            const pagesAfterSelectedPage = currentPage <=selectedPage +2;
            const pagesBeforeSelectedPages = currentPage >=selectedPage-2;

            if(firstAndLastPAge ||pagesBeforeSelectedPages && pagesAfterSelectedPage ){
                
                if(oldPage && currentPage -oldPage >2){
                    pages.push("...");
                }

                if(oldPage && currentPage -oldPage ==2){
                    pages.push(oldPage+1);
                }

                pages.push(currentPage);
                oldPage = currentPage;
            }
        } return pages;
    }else{
        let pages = [];
        return pages;
    }
   
    
}



const pagination = document.querySelector(".pagination");
const page = Number(pagination.dataset.page);
const total = Number(pagination.dataset.total);

const pages = paginate(page,total);

let elements = "";

for(let page of pages){
    if(String(page).includes(`...`)){
        elements+=`<span>${page}</span>`
    }else{
        elements+=`<a href="?page=${page}">${page}</a>`
    }
    
}

if(pages.length==0){
    pagination.innerHTML =elements;
}else{
   pagination.innerHTML=elements;
}









