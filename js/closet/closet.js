function init() {
    const addCategoryForm = document.getElementById('add-category-form');
    addCategoryForm.addEventListener('submit', handleFormSubmit);
    updateUsername();
}

function updateUsername() {
    auth.onAuthStateChanged((user) => {
        if (user) {
            document.getElementById('username').innerHTML = user.displayName;
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
    alert('category Added Successfully');
}

function listenToCategory() {
    const user = auth.currentUser;

    const listener = db.collection("categories").where("user", "==", user.uid).onSnapshot((querySnapshot) => {
            const closeList = document.getElementById('closetList');

            closeList.innerHTML = '';
            querySnapshot.forEach((doc) => {
                getCategoryImage(doc);
                closeList.innerHTML += renderCloseCard(doc);
                getCategoryImage(doc);
            });
    });
    window.removeFirebaseListener.push(listener);
}

function getCategoryImage(categoryDocument){
    const categoryId = categoryDocument.id;
    const closeList = document.getElementById('closetList');
    //var categoryImg = "";
    db.collection("posts").where("category","==",categoryId).where("type","==","closet-item").limit(1)
    .get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
           doc.data().uri;
           let imageElement = document.createElement("img");
           imageElement.src = `${doc.data().uri}`;
           closeList.appendChild(imageElement);
            //console.log(doc.data().uri);
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

       return `
       <div class="flex flex-column category-wrapper" >
           <a href="index.html#category?q=${categoryId}">
               <span>${categoryData.category}</span>
            </a>
            </div>
       `;
}

init();