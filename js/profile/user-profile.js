function init() {
    console.log("test");
    userDetails();

}

async function userDetails() {
const user = await getCurrentUser();
const userFieldsRef = await db.collection('users').doc(user.uid).get();
if (userFieldsRef.exists) {
    const userFields = userFieldsRef.data();
    const userName = document.getElementById('user-name');
    userName.innerHTML = userFields.username;
    const qPosts = document.getElementById('q-posts');

    if (user.photoURL) {
        const image = document.getElementById('profile-image');
        image.src = user.photoURL;
        image.classList.add('profile-image');
    }

    db.collection("posts").where("userID", "==", user.uid).where("type", "==", "community")
    .get().then((querySnapshot) => {
        qPosts.innerHTML = querySnapshot.size;

    });
 
}
}

init();