function init() {
  const postBtn = document.getElementById("postBtn");

  const imageSrc = document.getElementById("donate-input");
  const imageTarget = document.getElementById("image");

  const cameraBtn = document.getElementById("openCameraBtn");
  cameraBtn.addEventListener("click", openCamera);
  postBtn.addEventListener("click", uploadDonationDesc);

  document.getElementById("add-tag").addEventListener("click", addTagInput);

  //initImageListener(getCategoryIdFromUrl());
  addImageChangeListener(imageSrc, imageTarget);
  //initCategoryListener();
  document.getElementById("add-tag").addEventListener("click", addTagInput);
}

/**
 * handle add tag button
 */
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
/**
 * Trigger Image file input field
 */
function triggerDonateInput() {
  // let camera = document.getElementById("camera");
  // camera.innerHTML = "";
  document.getElementById("donate-input").click();
}

/**
 * Uploads Image to firestorage and returns a ref to uploaded object.
 * @returns {Promise<unknown>}
 */
async function donateItemImg(imgItem) {
  const currentDate = new Date();
  const storageRef = storage.ref();
  const userID = auth.currentUser.uid;
  const progress = document.getElementById("showStatus");
  const closetRef = storageRef.child(
    "donate/" + userID + "/" + currentDate.getTime()
  ); // reference to user storage folder
  return new Promise((resolve, reject) => {
    try {
      const uploadTask = closetRef.put(imgItem);
      progress.classList.remove("dn");
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          let uploadProgress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          progress.innerHTML = `Uploading... ${Math.round(uploadProgress)}%`;
        },
        (error) => {},
        () => {
          document.getElementById("image").removeAttribute("src");
          document.getElementById("donate-input").value = null;
          let camera = document.getElementById("camera");
          camera.innerHTML = "";
          progress.classList.add("dn");
          resolve(uploadTask.snapshot);
        }
      );
    } catch (error) {
      console.log(error.code);
      reject();
    }
  });
}

//**********************************
//*****check if image exists in canvas or donate-input */
async function imageInput() {
  const canvas = document.getElementById("canvas");
  const imageItem = document.getElementById("donate-input").files[0]; //image selected to upload by user
  let imageBlob;
  try {
    if (canvas) {
      imageBlob = await new Promise((resolve) =>
        canvas.toBlob(resolve, "image/png")
      ); //image captured by camera
    }
  } catch (err) {
    console.log(err);
  }
  let inputImage;

  if (imageItem) {
    inputImage = imageItem;
    return inputImage;
  }
  if (imageBlob) {
    inputImage = imageBlob;
    return inputImage;
  }
}

async function getUserData(uid) {
  return db.collection("users").doc(uid).get();
}

/**
 * Handle save btn
 *  @returns {Promise<void>}
 */
async function uploadDonationDesc(event) {
  event.preventDefault();
  const submitBtn = document.getElementById("postBtn");
  submitBtn.disabled = true;
  const userID = auth.currentUser.uid;
  const user = await getCurrentUser();
  const userData = await getUserData(user.uid);
  const comments = document.getElementById("comments").value;
  const location = document.getElementById("location").value;
  const tagsArray = JSON.parse(
    document.getElementById("tagsHiddenValue").value || "[]"
  );
  const imageValue = await imageInput();
  let imageUrl;
  if (
    imageValue == null ||
    location.trim().length < 1 ||
    comments.trim().length < 1 ||
    tagsArray.length < 1
  ) {
    console.log("Please don't leave any fields empty");
    return;
  }
  try {
    const imageRef = await donateItemImg(imageValue);
    imageUrl = await imageRef.ref.getDownloadURL();
  } catch (err) {
    console.error(err);
  }
  const locationCity = document.getElementById("location").value;
  const locationCoords = document.getElementById("locationCoords").value;
  let locationObject = {};
  if (locationCity && locationCoords) {
    locationObject = {
      city: locationCity,
      coords: JSON.parse(locationCoords),
    };
  }

  const itemObject = {
    userID,
    username: userData.data().username,
    comments,
    location,
    user_uri: user.photoURL,
    tags: tagsArray,
    uri: imageUrl,
    user_uri: user.photoURL,
    type: "donate-item",
    public: true,
    location: locationObject,
    timeStamp: timestamp(),
  };
  await db.collection("posts").add(itemObject);
  submitBtn.disabled = false;
  document.getElementById("comments").value = null;
  document.getElementById("location").value = null;
  document.getElementById("tags").value = null;
  document.getElementById("show-tags").innerHTML = "";
  document.getElementById("tagsHiddenValue").value = null;
  window.location.href = 'index.html#home'
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

//*************************************************** */
//******handle open camera button******************** */
//*************************************************** */
async function openCamera() {
  document.getElementById("image").removeAttribute("src");
  document.getElementById("donate-input").value = null;
  let camera = document.getElementById("camera");
  camera.innerHTML = '<video id="player" autoplay></video>';
  document.getElementById("capture-btn").innerHTML =
    '<button id="capture">Capture</button>';
  const player = document.getElementById("player");
  const captureButton = document.getElementById("capture");

  const constraints = {
    video: true,
  };

  captureButton.addEventListener("click", () => {
    camera.innerHTML =
      '<video id="player" width="0" style="display:none" autoplay></video><canvas id="canvas" width="376" height="296"></canvas>';
    const canvas = document.getElementById("canvas");
    const context = canvas.getContext("2d");
    // Draw the video frame to the canvas.
    context.drawImage(player, 0, 0, canvas.width, canvas.height);
    document.getElementById("capture-btn").innerHTML = "";

    // Stop all video streams.
    player.srcObject.getVideoTracks().forEach((track) => track.stop());
  });

  navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
    player.srcObject = stream;
  });
}

/**
 * Runs on get location button click
 */
function getCurrentUserLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(handleCoords);
  }
}
async function handleCoords(position) {
  const locationData = await reverseGeoCode(position);
  document.getElementById("location").value = locationData.address.city;
  console.log(position);
  const locationCoords = {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
  };
  document.getElementById("locationCoords").value =
    JSON.stringify(locationCoords);
}
init();
