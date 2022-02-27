
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