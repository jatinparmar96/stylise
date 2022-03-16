function init() {
renderUserProfile();
showUserPosts();
//Handle User Outfit Posts
const outfit = document.getElementById('profile-outfit')
outfit.addEventListener('click', showUserPosts);
// //Handle User Donate Posts
const donate = document.getElementById('profile-donate')
donate.addEventListener('click', showUserDonations);

}

/**
 * Get User Id parameter from the url.
 * @returns string
 */
function getUserIdFromUrl() {
    return window.location.href.split('?')[1].split('=')[1];
}




/**
 * Renders post on html page
 * @param {Firebase.Doc} post 
 */
async function renderUserProfile() {
    const userUid = await getUserIdFromUrl();
    const userFieldsRef = await db.collection('users').doc(userUid).get();
    if (userFieldsRef.exists) {
        const userFields = userFieldsRef.data();
        const userName = document.getElementById('user-name');
        userName.innerHTML = userFields.username;
        const qPosts = document.getElementById('q-posts');

        // if (user.photoURL) {
        //     const image = document.getElementById('profile-image');
        //     image.src = user.photoURL;
        //     image.classList.add('profile-image');
        // }

        db.collection("posts").where("userID", "==", userUid)
        .get().then((querySnapshot) => {
            qPosts.innerHTML = querySnapshot.size;

        });

    }
}

/**
 * add user posts into the wrapper
 * @method addUserPosts
 * @param doc
 */
 function addUserPosts(doc) {
    let div = document.createElement("div");
    div.classList.add("post");
    const link = document.createElement('a');
    link.href = `index.html#view-post?id=${doc.id}`;
    let img = document.createElement("img");
    img.src = doc.data().uri;
    link.appendChild(img)
    div.appendChild(link);
    document.getElementById("wrapper").appendChild(div);

 }

  /**
 * clears main before showing posts
 * @method clearWrapper
 */
function clearWrapper() {
    const wrapper = document.getElementById("wrapper");
    wrapper.innerHTML = "";
}

async function showUserPosts() {
    const userUid = await getUserIdFromUrl();
    clearWrapper();
    // fetch posts from "posts" collection with conditions
    db.collection("posts").where("userID", "==", userUid).where("type", "==", "community")
        .get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                addUserPosts(doc);
            });
        });

}

async function showUserDonations(user) {
    clearWrapper();
    const userUid = await getUserIdFromUrl();
    // fetch posts from "posts" collection with conditions
    db.collection("posts").where("userID", "==", userUid).where("type", "==", "donate-item")
        .get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                addUserPosts(doc);
            });
        });
}


init();