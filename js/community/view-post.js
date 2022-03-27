
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
    const postType = document.getElementById("type");
    const postImg = document.getElementById('postImg');
    const postComments = document.getElementById('postComments');
    const postTags = document.getElementById('postTags');
    const postUser = document.getElementById('postUser');

    postType.innerHTML = post.data().type;
    // postImg.src = post.data().uri;
    const imgContainer = document.getElementById("image-container");
    imgContainer.style.backgroundImage = `url(${post.data().uri})`;
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
                addPostsCommunity(doc);
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
                    addPostsDonation(doc);
                });
            }
            hideLoader();
        });
    }
    

}

/**
 * add posts into the wrapper
 * @method addPostsCommunity
 * @param
 */
 function addPostsCommunity(doc) {

    let span=document.getElementById("suggestions");
    span.innerHTML="You might also like...";
    let div = document.createElement("div");
    div.classList.add("post");
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
        let favoriteIcon = document.createElement("button");

        favoriteIcon.classList.add("favorite-icon");
        let favElement = document.createElement("i");
        favElement.classList.add("fa");
        favElement.classList.add("fa-heart");
        favoriteIcon.appendChild(favElement);
        div_user.appendChild(favoriteIcon);

    const postImg = document.createElement("div");
    postImg.classList.add("post-img");
    
    const link = document.createElement('a');
    link.href = `index.html#view-post?id=${doc.id}`;
    let img = document.createElement("img");
    img.src = doc.data().uri;
    link.appendChild(img)
    postImg.appendChild(link);
   



    /**
     * Add post to favorites function
     */
    favoriteIcon.onclick = async function addToFavorites() {
        console.log(`${doc.id} added to favorites`);
        const user = await getCurrentUser();
        const docFavRef = await db.collection('users/' + user.uid + '/favorites').doc(doc.id).set(doc.data());

    }
    div.appendChild(div_user);
    div.appendChild(postImg);
    
    
    document.getElementById("wrapper").appendChild(div);
   
 }

 /**
 * add posts into the wrapper
 * @method addPostsDonation
 * @param
 */
  function addPostsDonation(doc) {
    
    let span=document.getElementById("suggestions");
    span.innerHTML="You might also like...";
    let div = document.createElement("div");
    div.classList.add("post");
     let div_user = document.createElement("div");
    div_user.classList.add("user-info-donate");
    let img_user = document.createElement("img");
    img_user.classList.add("dp");
    img_user.src = doc.data().user_uri;
    div_user.appendChild(img_user);
    let username = document.createElement("span");
    const userLink = document.createElement('a');
    userLink.href = `index.html#view-user-profile?id=${doc.data().userID}`;
    username.innerHTML = doc.data().username;
    userLink.appendChild(username);
    let aux=document.createElement("div");
    aux.classList.add("aux");
    div_user.appendChild(userLink);
    div_user.appendChild(aux);

    const postImg = document.createElement("div");
    postImg.classList.add("post-img");
    
    const link = document.createElement('a');
    link.href = `index.html#view-post?id=${doc.id}`;
    let img = document.createElement("img");
    img.src = doc.data().uri;
    link.appendChild(img)
    postImg.appendChild(link);
   

    div.appendChild(div_user);
    div.appendChild(postImg);
    
    
    document.getElementById("wrapper").appendChild(div);
   
 }


init();