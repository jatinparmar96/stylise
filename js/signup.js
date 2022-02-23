import { firebaseApp } from '/js/firebase.js'
import { handleFacebookAuth, handleGoogleAuth } from './socialAuth.js'

function checkLogin() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            window.location.href = 'index.html#home'
        } else {
        }
    });
}
let errorElem;
let auth;
function init() {

    // Handle Social button
    const signUpBtn = document.getElementById('signup')
    const googelBtn = document.getElementById('google-button')
    const facebookBtn = document.getElementById('facebook-button')

    //Initialize error Element
    errorElem = document.getElementById('error');

    // Handle login button
    const loginBtn = document.getElementById('login');

    signUpBtn.addEventListener('click', emailSignUp);
    googelBtn.addEventListener('click', handleGoogleAuth);
    facebookBtn.addEventListener('click', handleFacebookAuth);
    auth = firebaseApp.auth();
    checkLogin();
}
init();

/**
 * Email sign up (firebase auth)
 * @method emailSignUp
 */
function emailSignUp() {

    const txtEmail = document.getElementById('email');
    const txtPassword = document.getElementById('password');
    const txtConfPassword = document.getElementById('conf-password');

    if (txtPassword.value === txtConfPassword.value) {
        auth
            .createUserWithEmailAndPassword(txtEmail.value, txtPassword.value)
            .then(function () {
                window.location.href = 'index.html#home';
            })
            .catch((error) => {
                console.log('Error in Sign Up : ' + error.code);
                errorElem.innerText = error.message;
            });
    } else {
        errorElem.innerText = "Those passwords didn't match. Try again.";
    }

}
