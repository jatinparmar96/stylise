function init() {
    //const userID; // variable to store user id
    const saveBtn = document.getElementById('saveBtn');
    // saveBtn.addEventListener('click', uploadItemDesc);
    const form = document.getElementById('add-item-form');

    const imageSrc = document.getElementById('image-input');
    const imageTarget = document.getElementById('image');

    const tags = document.getElementById('add-tag');
    tags.addEventListener('click', addTagInput);

    const cameraBtn = document.getElementById('openCameraBtn');
    form.addEventListener('submit', uploadItemDesc)
    // initImageListener(getCategoryIdFromUrl());
    addImageChangeListener(imageSrc, imageTarget)
    initCategoryListener();
}


/**
 * Parse url and return the parameter q={parameter}
 * @returns {string}
 */
// function getCategoryIdFromUrl() {
//     return window.location.hash.split('?')[1].split('=')[1];
// }

/**
 * Uploads Image to firestorage and returns a ref to uploaded object.
 * @returns {Promise<unknown>}
 */
async function uploadItemImg(imgItem) {
    const currentDate = new Date();
    const storageRef = storage.ref();
    const userID = auth.currentUser.uid;
    const closetRef = storageRef.child("closet/" + userID + "/" + currentDate.getTime())// reference to user storage folder
    const progressBar = getProgressBar();
    return new Promise((resolve, reject) => {
        try {
            const uploadTask = closetRef.put(imgItem)
            uploadTask.on('state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    setProgressBar(progressBar, progress);
                },
                (error) => {
                    // A full list of error codes is available at
                    // https://firebase.google.com/docs/storage/web/handle-errors
                    switch (error.code) {
                        case 'storage/unauthorized':
                            // User doesn't have permission to access the object
                            break;
                        case 'storage/canceled':
                            // User canceled the upload
                            break;

                        // ...

                        case 'storage/unknown':
                            // Unknown error occurred, inspect error.serverResponse
                            break;
                    }
                },
                () => {
                    // Upload completed successfully, now we can get the download URL
                    document.getElementById('image-input').value = null;
                    hideProgressBar(progressBar);
                    resolve(uploadTask.snapshot);
                }
            )
        }
        catch (error) {
            console.log(error.code);
            reject();
        }
    })
}

/**
 * Handle save btn
 *  @returns {Promise<void>}
 */
async function uploadItemDesc(event) {
    event.preventDefault();
    const category = document.getElementById('categories').value;
    const tagsArray = JSON.parse(document.getElementById('tagsHiddenValue').value || '[]');
    const imageItem = document.getElementById('image-input').files[0]; //image selected to upload by user
    const capturedImage = document.getElementById('capturedImage');
    const user = auth.currentUser.uid;
    let imageRef;

    if (!imageItem && !capturedImage) {
        return;
    }
    saveBtn.disabled = true;
    if (capturedImage) {
        const blob = await new Promise(resolve => capturedImage.toBlob(resolve))
        imageRef = await uploadItemImg(blob);
    }
    else {
        imageRef = await uploadItemImg(imageItem);
    }
    const imageUrl = await imageRef.ref.getDownloadURL();
    const itemObject = {
        category,
        keywords: tagsArray,
        uri: imageUrl,
        type: 'closet-item',
        userId: user,
        public: false
    };
    const docRef = await db.collection('posts').add(itemObject);
    saveBtn.disabled = false;
    window.location.href = `index.html#category?q=${itemObject.category}`;
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

// function initImageListener(categoryId) {
//     const query = db.collection(`posts`).where('category', '==', getCategoryIdFromUrl());
//     const listener = query.onSnapshot(querySnapshot => {
//         const categoryImages = document.getElementById('category-images');
//         categoryImages.innerHTML = '';
//        querySnapshot.forEach(doc =>{
//            categoryImages.innerHTML += renderImages(doc);

//        })
//     })
//     window.removeFirebaseListener.push(listener);
// }

/**
 * Listen To Category Collections
 */
async function initCategoryListener() {
    const user = await getCurrentUser();
    const query = db.collection(Models.categories).where('user', '==', user.uid);
    const listener = query.onSnapshot(querySnapshot => {
        const categoryList = document.getElementById('categories');
        categoryList.innerHTML = '';
        categoryList.innerHTML += `<option></option>
        <option value='custom'>Add Category</option>`
        querySnapshot.forEach(doc => {
            categoryList.innerHTML += renderDataListItem(doc);
        })
    })
    window.removeFirebaseListener.push(listener);
}

function renderDataListItem(itemDoc) {
    return `<option value=${itemDoc.id}>${itemDoc.data().category}</option>`
}

/**
 * Render a div containing Image from category.
 * @param imageDoc
 * @returns {string}
 */
// function renderImages(imageDoc){
//     const imageData = imageDoc.data();

//     return`
//         <div class="flex flex-column closet-item" style="max-width: 25%;">
//             <a href="index.html#view-item?id=${imageDoc.id}">
//             <img src="${imageData.uri}" style="object-fit: cover;height: 200px;width: 200px">
//             </a>
//             <span>${imageData.category}</span>
//             <span>${imageData.keywords}</span>
//         </div>
//     `
// }
/**
 * Trigger Image file input field
 */
function triggerImageInput() {
    document.getElementById('image-input').click();
}

/**
 * 
 * Add Image Change listener, same method form update-profile.js file
 */
function addImageChangeListener(src, target) {
    const fileReader = new FileReader();
    fileReader.onload = function () {
        target.src = this.result
        target.classList.add('profile-image')
    }
    src.addEventListener('change', function () {
        if (src.files.length) {
            fileReader.readAsDataURL(src.files[0])
        } else {
            target.classList.remove('profile-image');
            target.src = '';
        }

    })
}

function openCamera() {
    const video = document.getElementById('video-stream');
    const snapBtn = document.getElementById('snapPhotoBtn');
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        // Not adding `{ audio: true }` since we only want video now
        navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
            //video.src = window.URL.createObjectURL(stream);
            video.srcObject = stream;
            video.classList.remove('dn')
            snapBtn.classList.remove('dn');

            // video.play();  // or autplay
        });
    } else {
        alert('media devices not available in this browser');
    }
}

function captureImage() {
    const video = document.getElementById('video-stream');
    const canvasElement = document.createElement('canvas');
    const context = canvasElement.getContext('2d');
    canvasElement.width = video.videoWidth;
    canvasElement.height = video.videoHeight;
    canvasElement.id = 'capturedImage';
    context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
    document.getElementById('image').src = canvasElement.toDataURL('image/jpeg');
    const imageContainer = document.getElementById('imageContainer');
    canvasElement.classList.add('dn');
    if (imageContainer.lastElementChild.nodeName === 'CANVAS') {
        const prevCanvas = document.getElementById('capturedImage');
        imageContainer.replaceChild(canvasElement, prevCanvas);
    }
    else {
        imageContainer.appendChild(canvasElement);
    }
    const tracks = video.srcObject.getTracks();
    tracks.forEach((track) => track.stop());
    video.classList.add('dn');
}


function checkKeyVal(e) {
    // Check if enter key
    if (e.keyCode === 13) {
        addTagInput();
    }
}
function addTagInput() {
    const tagsArray = getTagsValue();
    const tagValue = document.getElementById('tags');
    if (tagValue.value != '' && tagValue.value.trim().length > 0) {
        const tags = tagValue.value.split(',').filter(val => val);
        tags.forEach(val => tagsArray.push(val));
    }
    setTagsValue(tagsArray);
    tagValue.value = null;
}
function removeTag(val) {
    let tagsArray = getTagsValue();
    tagsArray = tagsArray.filter(tag => tag !== val);
    setTagsValue(tagsArray);
}
function getTagsValue() {
    const hiddenTagsValueElement = document.getElementById('tagsHiddenValue')
    const tagsArray = JSON.parse(hiddenTagsValueElement.value || "[]");
    return tagsArray
}

function setTagsValue(tagsArray) {
    const showTags = document.getElementById('show-tags');
    const hiddenTagsValueElement = document.getElementById('tagsHiddenValue')
    hiddenTagsValueElement.value = JSON.stringify(tagsArray);
    showTags.innerHTML = '';
    tagsArray.forEach(val => {
        showTags.innerHTML += `<span class="tag">#${val} <span onclick="removeTag('${val}')">x</span> </span>`
    })
}
init();