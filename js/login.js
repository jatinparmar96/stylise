// ************Firebase Configuration******************************************
// ****************************************************************************
// import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-app.js";
// import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-analytics.js";

// const firebaseConfig = {
//     apiKey: "AIzaSyCLJath-3yXRUr4tUdbUgtZBmETHbabxvo",
//     authDomain: "stylisetest.firebaseapp.com",
//     projectId: "stylisetest",
//     storageBucket: "stylisetest.appspot.com",
//     messagingSenderId: "622177594893",
//     appId: "1:622177594893:web:a60c538bf60a9bb0902f44",
//     measurementId: "G-NCQYCRFE5L"
//   };

//   import {getDatabase, ref, set, child, get, update, remove}
//     from "https://www.gstatic.com/firebasejs/9.6.6/firebase-database.js"

//     const app = initializeApp(firebaseConfig);
//     const analytics = getAnalytics(app);

//     const db = getDatabase();

// ************HTML References*************************************************
// ****************************************************************************
const username = document.getElementById('username');
const password = document.getElementById('password');
//event listener
login.addEventListener('click', ()=>{
    ValidateInput();
});

// ************Input validation************************************************
// ****************************************************************************
function isEmptyOrSpaces(str){
    //returns true if username or password field inputs are null or only contains spaces
    return str === null || str.match(/^ *$/) !== null;
}

function ValidateInput(){
    //passes users inputs to isEmptyOrSpaces function
    if (isEmptyOrSpaces(username.value) || isEmptyOrSpaces(password.value)){
        alert("Please don't leave any field empty");
    }
    else {
        AuthenticateUser();
    }
}

// ************User Authentication Process*************************************
// ****************************************************************************
function AuthenticateUser(){
    const dbRef = ref(db);
    //get snapshot of UsersList database and verifies if user inputs match 
    get(child(dbRef, "UsersList/"+ username.value)).then((snapshot)=>{
        if(snapshot.exists()){
            let dbpassword = snapshot.val().password;
            if(dbpassword == password.value){
                userLogin();
            } else {
                alert("Wrong password");
            }
        } else {
            alert("Username is invalid");
        }
    });
}

// ************Password Decription process*************************************
// ****************************************************************************
// function decPass(dbpassword){
//     let pass = CryptoJS.AES.decrypt(dbpassword, password.value);
//     return pass.toString(CryptoJS.enc.Utf8);
// }

//*************Login function*************************************************/
//****************************************************************************/
function userLogin(){
    alert("Login successful!");
}