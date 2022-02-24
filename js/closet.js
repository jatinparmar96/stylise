import { firebaseApp } from '/js/firebase.js';
import { getStorage, uploadBytes, ref as myRef } from 'https://www.gstatic.com/firebasejs/9.5.0/firebase-storage.js';


let userID;

    firebase.auth().onAuthStateChanged(user => {
        if (!user) {
            console.log('user not logged in');
            redirectToLogin();
        } else {
            userID = user.uid;
           
            document.getElementById('upload')?.addEventListener('click', uploadItem);
        }
    });


async function uploadItem(){
    console.log(userID);
    const storage = getStorage(firebaseApp);
    //const storageRef = myRef(storage);
    const closetPath = userID+'/closet/category/img';
    const closetRef = myRef(storage, closetPath);
    //console.log(closetRef);

    let items = document.getElementById('img').files[0];

    uploadBytes(closetRef, items).then((snapshot) => {
        console.log('Uploaded a blob or file!');
    })
    .catch((error) => {
        console.log('Failed to upload : ' + error.code);
        // errorElem.innerText = error.message;
    });
}