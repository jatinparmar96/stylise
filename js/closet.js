import { firebaseConfig } from "/js/firebase.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.5.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.5.0/firebase-auth.js";
import { getStorage, uploadBytes, ref } from 'https://www.gstatic.com/firebasejs/9.5.0/firebase-storage.js';

initializeApp(firebaseConfig);

const auth = getAuth();

//const userID; // variable to store user id
let items = []; // array to store items to upload
const storage = getStorage(); // create a root reference

document.getElementById('upload').addEventListener('click', uploadItem); // event handler


async function uploadItem(){
    // check if there is a user logged in and get userID
    firebase.auth().onAuthStateChanged(user => {
        if (!user) {
            console.log('user not logged in');
            redirectToLogin();
        } else {
            let currentDate = new Date();
            const userID = auth.currentUser.uid;
            items = document.getElementById('img').files; //image selected to upload by user
            // for loop to upload multiple images to storage
            for (let i = 0; i < items.length; i++) {
                let closetRef = ref(storage, "closet/"+userID+"/"+currentDate.getTime()+i); // reference to user storage folder
                // method to upload file from user input
                uploadBytes(closetRef, items[i]).then((snapshot) => {
                    console.log('Uploaded a blob or file!');
                })
                .catch((error) => {
                    console.log('Failed to upload : ' + error.code);
                    // errorElem.innerText = error.message;
                });
            }
        }
    });
}