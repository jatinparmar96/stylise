//************************************************************
//************************************************************
//      Stylise - Authentication
//************************************************************
//************************************************************

/*************************************************************
 Firebase Config
 *************************************************************/
if (!window.firebase) {
    console.log('firebase not loaded');
}
// Web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDoDlxPRl9H3zE2Sbb2bfass8SGHQBE9Lo",
    authDomain: "stylise-1f1d8.firebaseapp.com",
    projectId: "stylise-1f1d8",
    storageBucket: "stylise-1f1d8.appspot.com",
    messagingSenderId: "615569272553",
    appId: "1:615569272553:web:d921d89b8b4eb7093eca78"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Firebase Authentication methods
const auth = firebase.auth();

//Current User
let currentUser;

const errorElem = document.getElementById('error');
/*************************************************************
 SignUp
 *************************************************************/

// Handle signup button
function init() {
    document.getElementById('signup')?.addEventListener('click', emailSignUp);
    document.getElementById('google-button').addEventListener('click', handleGoogleAuth);
    document.getElementById('facebook-button').addEventListener('click', handleFacebookAuth);
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

/*************************************************************
 LogIn
 *************************************************************/

// Handle login button
document.getElementById('login')?.addEventListener('click', emailLogIn);

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
            // window.location.href = 'login.html';
        })
        .catch((error) => {
            console.log('Error in Log In : ' + error.code);
            errorElem.innerText = error.message;
        });
}


/**
 * Login with the given provider
 * @param {firebase.auth.OAuthCredential} provider
 * @return void
 * 
 */
function OAuthLogin(provider) {
    firebase.auth()
        .signInWithPopup(provider)
        .then((result) => {
            window.location.href = "index.html#home"
        }).catch(error => console.log(error))
}

/**
 * Handle Google button click
 */
function handleGoogleAuth() {

    const provider = new firebase.auth.GoogleAuthProvider();
    OAuthLogin(provider);
}

/**
 * Handle Facebook button click
 */
function handleFacebookAuth() {
    const provider = new firebase.auth.FacebookAuthProvider();
    OAuthLogin(provider);
}