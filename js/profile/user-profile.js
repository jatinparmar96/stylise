function init() {
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
    userDetails();
    showUserPosts();
    //Handle User Outfit Posts
    const outfit = document.getElementById('profile-outfit')
    outfit.addEventListener('click', showUserPosts);
    //Handle User Donate Posts
    const donate = document.getElementById('profile-donate')
    donate.addEventListener('click', showUserDonations);

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
        image.style.backgroundImage = `url(${user.photoURL})`;
    }

    db.collection("posts").where("userID", "==", user.uid)
    .get().then((querySnapshot) => {
        qPosts.innerHTML = querySnapshot.size;

    });
 
}
}

/**
 * add user posts into the wrapper
 * @method addUserPosts
 * @param
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
    const user = await getCurrentUser();
    clearWrapper();
    // fetch posts from "posts" collection with conditions
    db.collection("posts").where("userID", "==", user.uid).where("type", "==", "community")
        .get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                addUserPosts(doc);
            });
        });

}

async function showUserDonations() {
    const user = await getCurrentUser();
    clearWrapper();
    // fetch posts from "posts" collection with conditions
    db.collection("posts").where("userID", "==", user.uid).where("type", "==", "donate-item")
        .get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                addUserPosts(doc);
            });
        });

}






init();