

function init() {

    // Handle Social button
    const signUpBtn = document.getElementById('signup')
    const googleBtn = document.getElementById('google-button')
    const facebookBtn = document.getElementById('facebook-button')

    //Initialize error Element
    errorElem = document.getElementById('error');

    // Handle login button
    const loginBtn = document.getElementById('login');

    signUpBtn.addEventListener('click', emailSignUp);
    googleBtn.addEventListener('click', handleGoogleAuth);
    facebookBtn.addEventListener('click', handleFacebookAuth);
}


/**
 * Email sign up (firebase auth)
 * @method emailSignUp
 */
function emailSignUp() {
    const auth = app.auth();
    const username = document.getElementById('username');
    const txtEmail = document.getElementById('email');
    const txtPassword = document.getElementById('password');
    const txtConfPassword = document.getElementById('conf-password');

    if (txtPassword.value === txtConfPassword.value) {
        auth
            .createUserWithEmailAndPassword(txtEmail.value, txtPassword.value)
            .then(async (userCredential) => {
                const user = userCredential.user;
                await db.collection(`users`).doc(user.uid).set({
                    'username': username.value
                })
                window.location.href = 'index.html#update-profile';
            })
            .catch((error) => {
                console.log('Error in Sign Up : ' + error.code);
                errorElem.innerText = error.message;
            });
    } else {
        errorElem.innerText = "Those passwords didn't match. Try again.";
    }

}
init()