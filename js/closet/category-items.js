function init() {
    //const userID; // variable to store user id
  //  const saveBtn = document.getElementById('saveBtn');
    // saveBtn.addEventListener('click', uploadItemDesc);
   // const form = document.getElementById('add-item-form');

   // const imageSrc = document.getElementById('image-input');
   // const imageTarget = document.getElementById('image');

   // const tags =document.getElementById('add-tag');
   // tags.addEventListener('click', addTagInput);

    //const cameraBtn = document.getElementById('openCameraBtn');
    //form.addEventListener('submit', uploadItemDesc)
    initImageListener(getCategoryIdFromUrl());
    //addImageChangeListener(imageSrc, imageTarget)
    //initCategoryListener();
    categoryName();
}


/**
 * Parse url and return the parameter q={parameter}
 * @returns {string}
 */
function getCategoryIdFromUrl() {
    return window.location.hash.split('?')[1].split('=')[1];
}

// async function getUserData(uid) {
//     return db.collection('users').doc(uid).get();
// }
async function categoryName(){
    const catElement = document.getElementById('categoryName');
    const categoryId = getCategoryIdFromUrl();
    const dbRef = db.collection("categories").doc(`${categoryId}`);

    dbRef.get().then((doc) => {
        if (doc.exists) {
            const docData = doc.data();
            catElement.innerHTML = `<span>${docData.category}</span>`;
        } else {
            console.log("Category not found.")
        }
    }).catch((error) => {
        console.log("Error getting document:",error);
    });
}


/**
 * Listen to Posts collection Changes.
 */

function initImageListener(categoryId) {
    const query = db.collection(`posts`).where('category', '==', getCategoryIdFromUrl());
    const listener = query.onSnapshot(querySnapshot => {
        const categoryImages = document.getElementById('category-images');
        categoryImages.innerHTML = '';
       querySnapshot.forEach(doc =>{
           categoryImages.innerHTML += renderImages(doc);
           
       })
    })
    window.removeFirebaseListener.push(listener);
}

/**
 * Render a div containing Image from category.
 * @param imageDoc
 * @returns {string}
 */
function renderImages(imageDoc){
    const imageData = imageDoc.data();
    
    return`
        <div class="flex flex-column closet-item">
            <a href="index.html#view-item?id=${imageDoc.id}">
                <div class="image-container">
                    <div class="item" style="background-image: url(${imageData.uri})"></div>
                </div>
            </a>
            <span>${imageData.keywords}</span>
        </div>
    `
}

init();