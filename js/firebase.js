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
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();
const auth = firebase.auth();

const timestamp = firebase.firestore.FieldValue.serverTimestamp;
// Firebase Authentication methods

async function getCurrentUser() {
    if (!auth.currentUser) {
        await initAuth();
        return auth.currentUser;
    }
    else {
        return auth.currentUser;
    }
}

/**
 * Wait for auth object to initialize before performing any operation.
 */
async function initAuth() {
    return new Promise((resolve, reject) => {
        auth.onAuthStateChanged(user => {
            resolve(user);
        })
    })
}