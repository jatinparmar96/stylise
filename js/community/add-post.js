

function init() {
    const saveBtn = document.getElementById('saveBtn');
    const form = document.getElementById('add-item-form');

    const imageSrc = document.getElementById('image-input');
    const imageTarget = document.getElementById('image');

    const tags =document.getElementById('add-tag');
    tags.addEventListener('click', addTagInput);

  
    addImageChangeListener(imageSrc, imageTarget);
      form.addEventListener('submit', uploadItemDesc);
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
        try {
            closetRef.put(imgItem).then((snapshot) => {
                document.getElementById('image-input').value = null;
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
async function uploadItemDesc(event) {
    event.preventDefault();
    const user = await getCurrentUser();
    console.log(user);
    const saveBtn = document.getElementById('saveBtn');
    const comments = document.getElementById('comments').value;
    const tagsArray = JSON.parse(document.getElementById('tagsHiddenValue').value || '[]');
    const imageItem = document.getElementById('image-input').files[0]; //image selected to upload by user
    const capturedImage = document.getElementById('capturedImage');
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
    const userData = await getUserData(user.uid);
    let itemObject = {
        public: true,
        type: 'community',
        keywords: tagsArray,
        comments: comments,
        uri: imageUrl,
        userID: user.uid,
        user_uri: user.photoURL,
        timeStamp: timestamp(),
    };
    if (userData.data().username) {
        itemObject = { ...itemObject, ...{ username: userData.data().username } }
    }
    else {
        itemObject = { ...itemObject, ...{ username: `You don't have a username` } }
    }
    const docRef = await db.collection('posts').add(itemObject);
    alert('item added');
    
    window.location.href = 'index.html#home'

}

async function getUserData(uid) {
    return db.collection('users').doc(uid).get();
}



function renderDataListItem(itemDoc) {
    return `<option value=${itemDoc.id}>${itemDoc.data().category}</option>`
}

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
      target.src = this.result;
      target.classList.add("input-image");
    };
    src.addEventListener("change", function () {
      if (src.files.length) {
        fileReader.readAsDataURL(src.files[0]);
      } else {
        target.classList.remove("input-image");
        target.src = "";
      }
    });
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
/**
 * This should be in a seperate file :(
 * Captures image
 * Possible params can be video element
 * Possible return values can be a canvas element with captured image
 */
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




