
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
    const saveBtn = document.getElementById('saveBtn');
    uploadBtn.addEventListener('click', uploadItemImg);
    // saveBtn.addEventListener('click', uploadItemDesc);
    const form = document.getElementById('add-item-form');
    form.addEventListener('submit', uploadItemDesc)
    downloadImg = document.getElementById('img-download');
    storageRef = storage.ref();

}

init();

async function uploadItemImg() {
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
    document.getElementById('img').value = null;
};

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
        const itemObject ={
            category: category,
            keywords: keywords,
            uri: " "
            //to save item img
            
        };
    const docRef = await db.collection('users').doc(auth.currentUser.uid)
        .collection('closet').add(itemObject);
    console.log('Document written with ID: ', docRef.id);

    } catch(error) {
        console.error('Error adding document: ', error);
    }

}

//to do: 
    // 1 - html: leave just save button to execute both functions
    // 2 - Create a save button handler function to execute both functions
    // 3 - link image to item description document
    //



