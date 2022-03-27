
async function init() {
    const postId = getPostIdFromUrl();
    if (postId) {
        const post = await getPostDetails(postId);
        renderPost(post);
        getSuggestions(post, postId);

    }
}

/**
 * Get Post Id parameter from the url.
 * @returns string
 */
function getPostIdFromUrl() {
    return window.location.href.split('?')[1].split('=')[1];
}


/**
 * Get Post Details for a given Post ID from firebase
 * @param {string} postId 
 * @returns {Promise<>}
 */
function getPostDetails(postId) {
    return db.collection(Models.post).doc(postId).get();
}

/**
 * Renders post on html page
 * @param {Firebase.Doc} post 
 */
function renderPost(post) {
    // Define Variables
    const postImg = document.getElementById('postImg');
    const postComments = document.getElementById('postComments');
    const postTags = document.getElementById('postTags');
    const postUser = document.getElementById('postUser');

    postImg.src = post.data().uri;
    postComments.innerHTML = post.data().comments;
    if (post.data().keywords?.length) {
        post.data().keywords.forEach(tag => {
            postTags.innerHTML += `<span>${tag}</span>`;
        })
    }
    postUser.innerHTML = post.data().username

}


/**
 * Get Related posts based on tags
 * @param {string} post
 * @returns {Promise<>}
 */
 async function getSuggestions(post, postID) {

    showLoader();
    const user = await getCurrentUser();
     // fetch posts from "posts" collection with conditions
     if (post.data().type=="community"){
        const keywords = post.data().keywords;
        db.collection("posts").where("userID", "!=", user.uid).where("public", "==", true).where("type", "==", "community").where("keywords", "array-contains-any", keywords)
        .get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                if(doc.id != postID)
                addPosts(doc);
            });
            hideLoader();
        });
    }
    if (post.data().type=="donate-item"){
        const tags = post.data().tags;
        console.log(tags);
        const data = db.collection("posts").where("userID", "!=", user.uid).where("public", "==", true).where("type", "==", "donate-item").where("tags", "array-contains-any", tags)
        .get().then((querySnapshot) => {
            if(querySnapshot){
                querySnapshot.forEach((doc) => {
                    if(doc.id != postID)
                    addPosts(doc);
                });
            }
            hideLoader();
        });
    }
    

}

/**
 * add posts into the wrapper
 * @method addPosts
 * @param
 */
 function addPosts(doc) {
    
    let div = document.createElement("div");
    div.classList.add("post");
    const link = document.createElement('a');
    link.href = `index.html#view-post?id=${doc.id}`;
    let img = document.createElement("img");
    img.src = doc.data().uri;
    link.appendChild(img)
    div.appendChild(link);
    let div_user = document.createElement("div");
    div_user.classList.add("user-info");
    let img_user = document.createElement("img");
    img_user.classList.add("dp");
    img_user.src = doc.data().user_uri;
    div_user.appendChild(img_user);
    let username = document.createElement("span");
    const userLink = document.createElement('a');
    userLink.href = `index.html#view-user-profile?id=${doc.data().userID}`;
    username.innerHTML = doc.data().username;
    userLink.appendChild(username)
    div_user.appendChild(userLink);

    // const all = document.getElementById('community-all');
    // const forYou = document.getElementById('community-for-you');
    // let favoriteIcon = document.createElement("button");

    // if (all.classList.contains('active') || forYou.classList.contains('active')) {
    //     favoriteIcon.classList.add("favorite-icon");
    //     let favElement = document.createElement("i");
    //     favElement.classList.add("fa");
    //     favElement.classList.add("fa-heart");
    //     favoriteIcon.appendChild(favElement);
    // }
    div.appendChild(div_user);
    document.getElementById("wrapper").appendChild(div);
 }



init();