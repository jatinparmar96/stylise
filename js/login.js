'use strict';

 function init() {
    // Handle Social button
    const googelBtn = document.getElementById('google-button')
    const facebookBtn = document.getElementById('facebook-button')
    const login = document.getElementById('login');

    googelBtn.addEventListener('click', handleGoogleAuth);
    login.addEventListener('click', emailLogIn);
    facebookBtn.addEventListener('click', handleFacebookAuth);
    console.log('init called');
}

/**
 * Email log up (firebase auth)
 * @method emailLogIn
 */
function emailLogIn() {
    const auth = app.auth();
    const errorElement = document.getElementById('error');
    const txtEmail = document.getElementById('email');
    const txtPassword = document.getElementById('password');
    auth.signInWithEmailAndPassword(txtEmail.value, txtPassword.value)
        .then((cred) => {
             window.location.href = 'index.html#home';
        })
        .catch((error) => {
            console.log('Error in Log In : ' + error.code);
            errorElement.innerText = error.message;
        });
}
init()
// window['/js/login.js'] = init;