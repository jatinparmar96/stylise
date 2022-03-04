function init() {
    //const userID; // variable to store user id
    const saveBtn = document.getElementById('saveBtn');
    // saveBtn.addEventListener('click', uploadItemDesc);
    const form = document.getElementById('add-item-form');
    form.addEventListener('submit', uploadItemDesc)
    listenCategoryImageChanges(getCategoryIdFromUrl());
}

init();

/**
 * Parse url and return the parameter q={parameter}
 * @returns {string}
 */
function getCategoryIdFromUrl() {
    return window.location.hash.split('?')[1].split('=')[1];
}

/**
 * Uploads Image to firestorage and returns a ref to uploaded object.
 * @returns {Promise<unknown>}
 */
async function uploadItemImg() {
    const currentDate = new Date();
    const storageRef = storage.ref();
    const userID = auth.currentUser.uid;
    const items = document.getElementById('img').files[0]; //image selected to upload by user
    // for loop to upload multiple images to storage
    const closetRef = storageRef.child("closet/" + userID + "/" + currentDate.getTime())// reference to user storage folder
    return new Promise((resolve, reject) => {
        closetRef.put(items).then((snapshot) => {
            document.getElementById('img').value = null;
            resolve(snapshot);
        }).catch((error) => {
            console.log(error.code);
            reject();
        })
    })
}

/**
 * Handle save btn
 *  @returns {Promise<void>}
 */
async function uploadItemDesc(event) {
    event.preventDefault();
    let category = document.getElementById('category').value;
    let keywords = document.getElementById('keywords').value;
    const categoryId = getCategoryIdFromUrl();
    try {

        const imageRef = await uploadItemImg();
        const imageUrl = await imageRef.ref.getDownloadURL()
        const itemObject = {
            category: category,
            keywords: keywords,
            uri: imageUrl
        };
        const docRef = await db.collection('categories').doc(categoryId)
            .collection('images').add(itemObject);
        /**
         * Only for testing
         */
        await addImageToPost(itemObject);
    } catch (error) {
        console.error('Error adding document: ', error);
    }

}
async function addImageToPost(itemObject) {

    const userRef = await getUserData(auth.currentUser.uid);
    const userData = userRef.data();
    const postRef = await db.collection('posts').add({
        user: {
            username: userData.username,
            location: userData.location,
            uid: userRef.id
        }, ...itemObject
    });
}

async function getUserData(uid) {
    return db.collection('users').doc(uid).get();
}

/**
 * Listen to Image collection Changes in a given Category.
 */

function listenCategoryImageChanges(categoryId) {
    const query = db.collection(`categories`).doc(categoryId).collection('images');
    query.onSnapshot(querySnapshot =>{
        const categoryImages = document.getElementById('category-images');
        categoryImages.innerHTML = '';
       querySnapshot.forEach(doc =>{
           categoryImages.innerHTML += renderImages(doc)
       })
    })
}

/**
 * Render a div containing Image from category.
 * @param imageDoc
 * @returns {string}
 */
function renderImages(imageDoc){
    const imageData = imageDoc.data();
    return`
        <div class="flex flex-column closet-item" style="max-width: 25%;">
            <img src="${imageData.uri}" style="object-fit: cover;height: 200px;width: 200px">
            <span>${imageData.category}</span>
            <span>${imageData.keywords}</span>
        </div>
    `
}

//to do:
// 1 - html: leave just save button to execute both functions
// 2 - Create a save button handler function to execute both functions
// 3 - link image to item description document
//



