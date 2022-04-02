function init() {
    const addCategoryForm = document.getElementById('add-category-form');
    addCategoryForm.addEventListener('submit', handleFormSubmit);
    const closeList = document.getElementById('closetList');
    closeList.innerHTML = '';
    updateUsername();
}

function updateUsername() {
    auth.onAuthStateChanged((user) => {
        if (user) {
            //document.getElementById('username').innerHTML = user.displayName;
            listenToCategory();
        }
    })
}

async function handleFormSubmit(event) {
    event.preventDefault();
    const user = auth.currentUser;
    const categoryName = document.getElementById('category-name').value;
    await db.collection('categories').add({
        user: user.uid,
        category: categoryName
    })
    const categoryForm = document.getElementById("add-category");
    const disableLinks = document.getElementById("disableLinks");
    categoryForm.style.removeProperty('z-index');
    categoryForm.style.zIndex = '-5';
    disableLinks.style.removeProperty('z-index');
    disableLinks.style.zIndex = '-10';
}

function listenToCategory() {
    const user = auth.currentUser;

    const listener = db.collection("categories").where("user", "==", user.uid).onSnapshot((querySnapshot) => {
            const closeList = document.getElementById('closetList');

            closeList.innerHTML = '';
            querySnapshot.forEach((doc) => {
                let div = document.createElement("div");
                div.classList.add("category-wrapper");
                const link = document.createElement('a');
                link.href = `index.html#category?q=${doc.id}`;
                link.setAttribute("id",`${doc.id}`);
                link.classList.add("catLink");
                getCategoryImage(doc);
                let catName = document.createElement('div');
                catName.classList.add("catName-wrapper");
                let span = document.createElement('span');
                span.innerHTML = `${renderCloseCard(doc)}`;
                // let img = document.createElement("img");
                // img.src = doc.data().uri;
                // link.appendChild(img)
                catName.appendChild(span);
                link.appendChild(catName);
                div.appendChild(link);
                closeList.appendChild(div);
                // closeList.innerHTML += renderCloseCard(doc);
            });
        allItems();
    });
    window.removeFirebaseListener.push(listener) 
}

function getCategoryImage(categoryDocument){
    const categoryId = categoryDocument.id;
    //const closeList = document.getElementById('closetList');
    //var categoryImg = "";
    db.collection("posts").where("category","==",categoryId).where("type","==","closet-item").limit(1)
    .get().then((querySnapshot) => {
        if (querySnapshot.empty){
            const link = document.getElementById(`${categoryId}`);
                let imageWrapper = document.createElement("div");
                imageWrapper.classList.add("catImageWrapper");
                let Imagediv = document.createElement("div");
                Imagediv.classList.add("categoryImage");
                Imagediv.style.backgroundImage = 'url(../../assets/noItemsImage.jpg)';
                imageWrapper.appendChild(Imagediv);
                link.prepend(imageWrapper);  
        }
        querySnapshot.forEach((doc) => {
                doc.data().uri;
                const link = document.getElementById(`${categoryId}`);
                let imageWrapper = document.createElement("div");
                imageWrapper.classList.add("catImageWrapper");
                let Imagediv = document.createElement("div");
                Imagediv.classList.add("categoryImage");
                Imagediv.style.backgroundImage = `url(${doc.data().uri})`;
                imageWrapper.appendChild(Imagediv);
                link.prepend(imageWrapper);
            console.log(doc.data().uri);
            //console.log(imageUri(doc));
        });
       });
}

// function imageUri(document){
//     const docImage = document.data()
//     const docCatImg = docImage.uri;
//     console.log(docCatImg);
// }

function renderCloseCard(categoryDocument) {
    //getCategoryImage();
    const categoryId = categoryDocument.id;
    console.log(categoryId);
    const categoryData = categoryDocument.data();
    const categoryName = categoryData.category;

    return categoryName;
}

function allItems(){
    const user = auth.currentUser;
    const closeList = document.getElementById('closetList');
    //closeList.innerHTML = '';
    db.collection("posts").where("userId","==",user.uid).where("type","==","closet-item").limit(1)
    .get().then((querySnapshot) => {
        if (querySnapshot.empty){
            //const closeList = document.getElementById('closetList');
                let div = document.createElement("div");
                div.classList.add("category-wrapper");
                const link = document.createElement('a');
                link.href = `index.html#category`;
                link.setAttribute("id","all-items");
                link.classList.add("catLink");
                let catName = document.createElement('div');
                catName.classList.add("catName-wrapper");
                let span = document.createElement('span');
                span.innerHTML = "All Items";
                catName.appendChild(span);
                link.appendChild(catName);
                let imageWrapper = document.createElement("div");
                imageWrapper.classList.add("catImageWrapper");
                let Imagediv = document.createElement("div");
                Imagediv.classList.add("categoryImage");
                    Imagediv.style.backgroundImage = 'url(../../assets/noItemsImage.jpg)';
                    imageWrapper.appendChild(Imagediv);
                    link.prepend(imageWrapper);
                    div.appendChild(link);
                    closeList.prepend(div);
        }
        querySnapshot.forEach((doc) => {
            //const closeList = document.getElementById('closetList');
                let div = document.createElement("div");
                div.classList.add("category-wrapper");
                const link = document.createElement('a');
                link.href = `index.html#category`;
                link.setAttribute("id","all-items");
                //getCategoryImage(doc);
                let catName = document.createElement('div');
                catName.classList.add("catName-wrapper");
                let span = document.createElement('span');
                span.innerHTML = "All Items";
                catName.appendChild(span);
                link.appendChild(catName);
                let imageWrapper = document.createElement("div");
                imageWrapper.classList.add("catImageWrapper");
                let Imagediv = document.createElement("div");
                Imagediv.classList.add("categoryImage");
                    Imagediv.style.backgroundImage = `url(${doc.data().uri})`;
                    imageWrapper.appendChild(Imagediv);
                    link.prepend(imageWrapper);
                    div.appendChild(link);
                    closeList.prepend(div);
            });
        addCategoryContainer();
    });
};

function addCategoryContainer(){
    const closeList = document.getElementById('closetList');
    let div = document.createElement("div");
    div.classList.add("category-wrapper");
    div.classList += " catAddContainer";
    let imageWrapper = document.createElement("div");
    imageWrapper.classList.add("catImageWrapper");
    let Imagediv = document.createElement("div");
    Imagediv.classList.add("categoryImage");
    Imagediv.setAttribute("id",'addCat-container');
    Imagediv.style.backgroundImage = 'url(/assets/addCategoryImage.jpg)';
    imageWrapper.appendChild(Imagediv);
    div.appendChild(imageWrapper);
    closeList.appendChild(div);

    const categoryForm = document.getElementById("add-category");
    const disableLinks = document.getElementById("disableLinks");
    Imagediv.addEventListener('click',()=>{
        categoryForm.style.removeProperty('z-index');
        categoryForm.style.zIndex = '10';
        categoryForm.style.left = '0';
        disableLinks.style.removeProperty('z-index');
        disableLinks.style.zIndex = '5';
    });

    document.addEventListener('click',(event)=>{
        let clickInside = categoryForm.contains(event.target);
        let clickInsideImagediv = Imagediv.contains(event.target);
        if (!clickInside && !clickInsideImagediv){
            categoryForm.style.removeProperty('z-index');
            categoryForm.style.zIndex = '-5';
            disableLinks.style.removeProperty('z-index');
            disableLinks.style.zIndex = '-10';
        }
    });
};

init();