let auth;
let items;
let downloadImg;
let storageRef;
function init() {

    auth = app.auth();
    //const userID; // variable to store user id
    items = []; // array to store items to upload
    // const storage = getStorage(); // create a root reference

    const uploadBtn = document.getElementById('upload'); // event handler
    uploadBtn.addEventListener('click', uploadItem);
    downloadImg = document.getElementById('img-download');
    storageRef = storage.ref();

}

init();

async function uploadItem() {
    let currentDate = new Date();
    const userID = auth.currentUser.uid;
    items = document.getElementById('img').files; //image selected to upload by user
    // for loop to upload multiple images to storage
    for (let i = 0; i < items.length; i++) {
        let closetRef = storageRef.child("closet/" + userID + "/" + currentDate.getTime() + i) // reference to user storage folder
        // method to upload file from user input
        closetRef.put(items[i]).then((snapshot) => {
            console.log('Uploaded a blob or file!');
            // method to get the image cloud storage url
            snapshot.ref.getDownloadURL()
                .then((url) => {
                    console.log(url);
                    downloadImg.innerHTML += (`<img src="${url}">`);
                })
                .catch((error) => {
                    console.log(error.code);
                });
        })
            .catch((error) => {
                console.log('Failed to upload : ' + error);
                // errorElem.innerText = error.message;
            });
    }
};