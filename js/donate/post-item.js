

function init() {
    //const userID; // variable to store user id
    //const postBtn = document.getElementById('postBtn');
    // saveBtn.addEventListener('click', uploadItemDesc);
    const postBtn = document.getElementById('postBtn');

    const imageSrc = document.getElementById('donate-input');
    const imageTarget = document.getElementById('image');

    //const cameraBtn = document.getElementById('openCameraBtn');
    postBtn.addEventListener('click', uploadDonationDesc);
    //initImageListener(getCategoryIdFromUrl());
    addImageChangeListener(imageSrc, imageTarget);
    //initCategoryListener();
}

init();

document.getElementById('add-tag').addEventListener('click', addTagInput);
let tagValue = document.getElementById('tags');
let tagsArray = [];
function addTagInput(){
    if (tagValue.value != '' && tagValue.value.trim().length > 0){
    tagsArray.push(tagValue.value);
    }
}

/**
 * Trigger Image file input field
 */
 function triggerDonateInput() {
    document.getElementById('donate-input').click();
}

/**
 * Uploads Image to firestorage and returns a ref to uploaded object.
 * @returns {Promise<unknown>}
 */
 async function donateItemImg(imgItem) {
    const currentDate = new Date();
    const storageRef = storage.ref();
    const userID = auth.currentUser.uid;
    const closetRef = storageRef.child("donate/" + userID + "/" + currentDate.getTime());// reference to user storage folder
    return new Promise((resolve, reject) => {
        try {
            closetRef.put(imgItem).then((snapshot) => {
                document.getElementById('donate-input').value = null;
                resolve(snapshot);

            })
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
 async function uploadDonationDesc(event) {
    event.preventDefault();
    const userID = auth.currentUser.uid;
    const comments = document.getElementById('comments').value;
    const location = document.getElementById('location').value;
    //const tags = document.getElementById('tags').value;
    const imageItem = document.getElementById('donate-input').files[0]; //image selected to upload by user
    if (!imageItem) {
            return;
    }
    const imageRef = await donateItemImg(imageItem);
    const imageUrl = await imageRef.ref.getDownloadURL()
    console.log(imageUrl);
        const itemObject = {
            userID,
            comments,
            location,
            tags : tagsArray,
            uri: imageUrl,
            type: 'donate-item',
            public: true
        };
        await db.collection('posts').add(itemObject);
}

/**
 * 
 * Add Image Change listener, same method form update-profile.js file
 */
 function addImageChangeListener(src, target) {
    const fileReader = new FileReader();
    fileReader.onload = function () {
        target.src = this.result;
        target.classList.add('profile-image');
    }
    src.addEventListener('change', function () {
        if (src.files.length) {
            fileReader.readAsDataURL(src.files[0]);
        } else {
            target.classList.remove('profile-image');
            target.src = '';
        }

    })
}