import {app} from '/js/firebase.js';

function handleBtnClick() {

}

function init() {
    document.getElementById('logout').addEventListener('click', logoutCurrentUser)

    document.getElementById('addData').addEventListener('click',handleBtnClick);
    checkLogin();
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

function redirectToLogin() {
    window.location.href = 'index.html#login'
}
init();
