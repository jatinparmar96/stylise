let items;
let downloadImg;
let storageRef;
let categoryId;

function init() {
    //const userID; // variable to store user id
    items = []; // array to store items to upload
    // const storage = getStorage(); // create a root reference
    categoryId = getCategoryIdFromUrl();
    const saveBtn = document.getElementById('saveBtn');
    // saveBtn.addEventListener('click', uploadItemDesc);
    const form = document.getElementById('add-item-form');
    form.addEventListener('submit', uploadItemDesc)
    downloadImg = document.getElementById('img-download');
    storageRef = storage.ref();
    listenCategoryImageChanges(categoryId);
}

init();

/**
 * Parse url and return the parameter q={parameter}
 * @returns {string}
 */
function getCategoryIdFromUrl() {
    return window.location.hash.split('?')[1].split('=')[1];
}

async function uploadItemImg() {
    const currentDate = new Date();
    const userID = auth.currentUser.uid;
    items = document.getElementById('img').files[0]; //image selected to upload by user
    // for loop to upload multiple images to storage
    const closetRef = storageRef.child("closet/" + userID + "/" + currentDate.getTime())// reference to user storage folder
    return new Promise((resolve, reject) => {
        closetRef.put(items).then((snapshot) => {
            console.log('Uploaded a blob or file!');
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
    console.log('test');
    event.preventDefault();
    let category = document.getElementById('category').value;
    let keywords = document.getElementById('keywords').value;
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
        console.log('Document written with ID: ', docRef.id);

    } catch (error) {
        console.error('Error adding document: ', error);
    }

}

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

function renderImages(imageDoc){
    const imageData = imageDoc.data();
    console.log(imageData);
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



