

function init() {
    const postBtn = document.getElementById('postBtn');

    const imageSrc = document.getElementById('donate-input');
    const imageTarget = document.getElementById('image');

    const cameraBtn = document.getElementById('openCameraBtn');
    cameraBtn.addEventListener('click', openCamera);
    postBtn.addEventListener('click', uploadDonationDesc);
    //initImageListener(getCategoryIdFromUrl());
    addImageChangeListener(imageSrc, imageTarget);
    //initCategoryListener();
}

init();

/**
 * handle add tag button
 */
document.getElementById('add-tag').addEventListener('click', addTagInput);
let tagValue = document.getElementById('tags');
let tagsArray = []; //array to store tags
function addTagInput(){
    if (tagValue.value != '' && tagValue.value.trim().length > 0){
    tagsArray.push(tagValue.value); //stores tag in an array
    }
    tagValue.value = null;
}

/**
 * Trigger Image file input field
 */
 function triggerDonateInput() {
    let camera = document.getElementById('camera');
    camera.innerHTML = '';
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
                document.getElementById('image').removeAttribute('src');
                document.getElementById('donate-input').value = null;
                let camera = document.getElementById('camera');
                camera.innerHTML = '';
                resolve(snapshot);

            })
        }
        catch (error) {
            console.log(error.code);
            reject();
        }
    })
}

//**********************************
//*****check if image exists in canvas or donate-input */
async function imageInput() {
  const canvas = document.getElementById('canvas');
  const imageItem = document.getElementById('donate-input').files[0];//image selected to upload by user
  let imageBlob;
  try {
    imageBlob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));//image captured by camera 
  } catch (err) {
    console.log(err);
  }
  let inputImage;

  if (imageItem) {
    inputImage = imageItem;
    return inputImage;
  } 
  if (imageBlob){
    inputImage = imageBlob;
    return inputImage;
  }
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
    const imageValue = await imageInput();
   
    if ((imageValue == null)||(location.trim().length < 1)||(comments.trim().length < 1)||(tagsArray.length < 1)) {
      console.log("Please don't leave any fields empty");
      return;
    }
    const imageRef = await donateItemImg(imageValue);
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

        document.getElementById('comments').value = null;
        document.getElementById('location').value = null;
        document.getElementById('tags').value = null;
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

//*************************************************** */
//******handle open camera button******************** */
//*************************************************** */
async function openCamera(){
  document.getElementById('image').removeAttribute('src');
  document.getElementById('donate-input').value = null;
  let camera = document.getElementById('camera');
  camera.innerHTML = '<video id="player" autoplay></video>';
  document.getElementById('capture-btn').innerHTML = '<button id="capture">Capture</button>';
  const player = document.getElementById('player');
  const captureButton = document.getElementById('capture');

  const constraints = {
    video: true,
  };

  captureButton.addEventListener('click', () => {
    camera.innerHTML = '<video id="player" width="0" style="display:none" autoplay></video><canvas id="canvas" width="376" height="296"></canvas>';
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');
    // Draw the video frame to the canvas.
    context.drawImage(player, 0, 0, canvas.width, canvas.height);
    document.getElementById('capture-btn').innerHTML = '';
    
    // Stop all video streams.
    player.srcObject.getVideoTracks().forEach(track => track.stop());
  });


  navigator.mediaDevices.getUserMedia(constraints)
    .then((stream) => {
      player.srcObject = stream;
    });

}