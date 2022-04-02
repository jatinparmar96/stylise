function init() {
    renderUserProfile();
    showUserPosts();
    // Get the container element
    let btnsContainer = document.getElementById("post-type-nav");
    // Get all buttons with class="nav-btn" inside the container
    let btns = btnsContainer.getElementsByClassName("nav-btn");
    /**
     * identify active post-type tab // Loop through the buttons and add the active class to the current/clicked button
     */
    for (let i = 0; i < btns.length; i++) {
        btns[i].addEventListener("click", function () {
            let current = document.getElementsByClassName("active");
            current[0].className = current[0].className.replace(" active", "");
            this.className += " active";
        });
    }
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

        if (userFields['profile-image']) {
            const image = document.getElementById('profile-image');
            const pic = userFields['profile-image'];
            image.style.backgroundImage = `url(${pic})`;
        }

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
    let rectangle = document.createElement("div");
    rectangle.classList.add("rectangle");
    const link = document.createElement('a');
    link.href = `index.html#view-post?id=${doc.id}`;
    let post = document.createElement("div");
    post.classList.add("post");
    post.style.backgroundImage = `url(${doc.data().uri})`;

    link.appendChild(post)
    rectangle.appendChild(link);
    document.getElementById("wrapper").appendChild(rectangle);



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