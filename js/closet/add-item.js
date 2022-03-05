function init() {
    //const userID; // variable to store user id
    const saveBtn = document.getElementById('saveBtn');
    // saveBtn.addEventListener('click', uploadItemDesc);
    const form = document.getElementById('add-item-form');
    form.addEventListener('submit', uploadItemDesc)
    initImageListener(getCategoryIdFromUrl());
    initCategoryListener();
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
async function uploadItemImg(imgItem) {
    const currentDate = new Date();
    const storageRef = storage.ref();
    const userID = auth.currentUser.uid;
    const closetRef = storageRef.child("closet/" + userID + "/" + currentDate.getTime())// reference to user storage folder
    return new Promise((resolve, reject) => {
        closetRef.put(imgItem).then((snapshot) => {
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
    const category = document.getElementById('category').value;
    const keywords = document.getElementById('keywords').value;
    const imageItem = document.getElementById('img').files[0]; //image selected to upload by user
    const categoryId = getCategoryIdFromUrl();
    try {
        if (!imageItem) {
            return;
        }
        const imageRef = await uploadItemImg(imageItem);
        const imageUrl = await imageRef.ref.getDownloadURL()
        const itemObject = {
            categoryId,
            keywords: keywords,
            uri: imageUrl,
            type: 'closet-item',
            public: false
        };
        const docRef = await db.collection('posts').add(itemObject);

    } catch (error) {
        console.error('Error adding document: ', error);
    }

}

function toggleInput(hideField, showField) {
    hideField.disabled = true;
    hideField.style.display = 'none';
    showField.disabled = false;
    showField.style.display = 'flex';
    showField.childNodes.forEach(node => {
        node.disabled = false;
        if (node.type === 'text') {
            node.focus();
        }
    })
}
function toggleSelect(inputElement) {
    if (inputElement.value === '') {
        disableInput(inputElement)
    }
}
function disableInput(inputElement) {
    inputElement.parentElement.style.display = 'none';
    inputElement.disabled = true;
    inputElement.parentElement.previousElementSibling.style.display = 'inline';
    inputElement.parentElement.previousElementSibling.disabled = false;
}
function checkOptionValue(selectField) {
    console.log(selectField.nextSibling)
    if (selectField.options[selectField.selectedIndex].value === 'custom') {
        toggleInput(selectField, selectField.nextElementSibling);
        selectField.selectedIndex = 0;
    }
}
function setCategorySelectValue(value) {
    document.getElementById('categories').value = value;
}
async function addCategory() {
    const categoryInput = document.getElementById('category-input');
    const doc = await db.collection(Models.categories).add({
        category: categoryInput.value,
        user: auth.currentUser.uid
    })
    disableInput(categoryInput);
    setCategorySelectValue(doc.id);
}
async function getUserData(uid) {
    return db.collection('users').doc(uid).get();
}


/**
 * Listen to Posts collection Changes.
 */

function initImageListener(categoryId) {
    const query = db.collection(`posts`);
    query.onSnapshot(querySnapshot =>{
        const categoryImages = document.getElementById('category-images');
        categoryImages.innerHTML = '';
       querySnapshot.forEach(doc =>{
           categoryImages.innerHTML += renderImages(doc)
       })
    })
}

/**
 * Listen To Category Collections
 */
async function initCategoryListener() {
    const query = db.collection(Models.categories);
    query.onSnapshot(querySnapshot => {
        const categoryList = document.getElementById('categories');
        categoryList.innerHTML = '';
        categoryList.innerHTML += `<option></option>
        <option value='custom'>Add Category</option>`
        querySnapshot.forEach(doc => {
            categoryList.innerHTML += renderDataListItem(doc);
        })
    })
}

function renderDataListItem(itemDoc) {
    return `<option value=${itemDoc.id}>${itemDoc.data().category}</option>`
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



