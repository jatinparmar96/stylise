 
function logoutCurrentUser() {
    firebase.auth().signOut().then(() => {
        redirectToLogin();
   });
}

firebase.auth().onAuthStateChanged(user => {
    if (!user) {
        redirectToLogin();
    } else {
    }
});

function redirectToLogin() {
    window.location.href = '/login.html'
}