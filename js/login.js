import { firebaseApp } from '/js/firebase.js'
import { handleFacebookAuth, handleGoogleAuth } from '/js/socialAuth.js'

const auth = firebaseApp.auth();

let errorElement;
function init() {
    // Handle Social button
    const googelBtn = document.getElementById('google-button')
    const facebookBtn = document.getElementById('facebook-button')

    document.getElementById('login').addEventListener('click', emailLogIn);
    errorElement = document.getElementById('error');
    googelBtn.addEventListener('click', handleGoogleAuth);
    facebookBtn.addEventListener('click', handleFacebookAuth);

}
init();

/**
 * Email log up (firebase auth)
 * @method emailLogIn
 */
function emailLogIn() {
    const txtEmail = document.getElementById('email');
    const txtPassword = document.getElementById('password');

    auth.signInWithEmailAndPassword(txtEmail.value, txtPassword.value)
        .then((cred) => {
            console.log(cred);
            window.location.href = "index.html#home";
            // window.location.href = 'login.html';
        })
        .catch((error) => {
            console.log('Error in Log In : ' + error.code);
            errorElement.innerText = error.message;
        });
}
