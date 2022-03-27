

function init() {
    document.getElementById('logout').addEventListener('click', logoutCurrentUser)

    loadUserProfileImages();
    // checkLogin();
}
function logoutCurrentUser() {
    app.auth().signOut().then(() => {
        redirectToLogin();
    });
}

function checkLogin() {
    firebase.auth().onAuthStateChanged(user => {
        if (!user) {
            console.log('user not logged in');
            redirectToLogin();
        } else {
            console.log('user is still logged in');
        }
    });

}
function openOverlay() {
    const elm = document.getElementById('overlay-element');
    elm.classList.remove('dn');
}

function redirectToLogin() {
    window.location.href = 'index.html#login'
}

async function loadUserProfileImages() {
    const user = await getCurrentUser();
    const profileLogo = document.querySelectorAll('header .profile-photo');
    profileLogo.forEach(logoItem => {
        logoItem.src = user.photoURL;
        logoItem.classList.remove('dn');
    })
    const usernameElement = document.getElementById('username-area');
    usernameElement.textContent = user.email
}


init();