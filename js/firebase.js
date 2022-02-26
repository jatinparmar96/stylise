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

// Firebase Authentication methods
export { app,db };