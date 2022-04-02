
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
    const postUserImg = document.getElementById('postUserImg');

    postType.innerHTML = post.data().type;
    // postImg.src = post.data().uri;
    const imgContainer = document.getElementById("image-container");
    imgContainer.style.backgroundImage = `url(${post.data().uri})`;
    postComments.innerHTML = post.data().comments;
    if (post.data().type==="donate-item") {
       
        const location=document.getElementById("location-container");
        const locationTitle=document.createElement("h3");
        locationTitle.classList.add("location-title");
        locationTitle.innerHTML="Location";
        const city=document.createElement("span");
        city.classList.add("location-city");
        city.innerHTML=post.data().location.city;
        location.appendChild(locationTitle);
        location.appendChild(city);



        if (post.data().tags?.length) {
            post.data().tags.forEach(tag => {
                postTags.innerHTML += `<span>#${tag}</span>`;
                }) 

        } 
       

    }else {

        if (post.data().keywords?.length) {
            post.data().keywords.forEach(tag => {
                postTags.innerHTML += `<span>#${tag}</span>`;
                    })    
        }
    }

    

  
    const link= document.getElementById('profile-link');
    link.href=`index.html#view-user-profile?id=${post.data().userID}`;
    const imglink= document.getElementById('img-link');
    imglink.href=`index.html#view-user-profile?id=${post.data().userID}`;
    postUser.innerHTML = post.data().username
    postUserImg.src=post.data().user_uri;

}


/**
 * Get Related posts based on tags
 * @param {string} post
 * @returns {Promise<>}
 */
 async function getSuggestions(post, postID) {

    showLoader();
    const user = await getCurrentUser();
    const userFavourites = await getUserFavorites(user.uid);

     // fetch posts from "posts" collection with conditions
     if (post.data().type=="community"){
        const keywords = post.data().keywords;
        db.collection("posts").where("userID", "!=", user.uid).where("public", "==", true).where("type", "==", "community").where("keywords", "array-contains-any", keywords)
        .get().then((querySnapshot) => {
            let index=0;
            querySnapshot.forEach((doc) => {
                if(doc.id != postID)
                addPostsCommunity(doc,index,userFavourites);
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

async function getUserFavorites(userID) {
    const userFavouritesDocs = await db.collection(`users/${userID}/favorites`).get();
    let userFavourites = [];
    userFavouritesDocs.forEach(doc => {
        userFavourites.push(doc.id)
    });
    return userFavourites;
}

/**
 * add posts into the wrapper
 * @method addPostsCommunity
 * @param
 */
 function addPostsCommunity(doc, index = 0, userFavourites = undefined) {

    let span=document.getElementById("suggestions");
    span.innerHTML="You might also like...";
    let div = document.createElement("div");
    div.classList.add("post");
    //user Info
     let div_user = document.createElement("div");
    div_user.classList.add("user-info");

    const imgLink = document.createElement('a');
    imgLink.href = `index.html#view-user-profile?id=${doc.data().userID}`;
    let img_user = document.createElement("img");
    img_user.classList.add("dp");
    img_user.src = doc.data().user_uri;
    imgLink.appendChild(img_user);
    div_user.appendChild(imgLink);

    let username = document.createElement("span");
    // Create Link
    const userLink = document.createElement('a');
    userLink.href = `index.html#view-user-profile?id=${doc.data().userID}`;
    username.innerHTML = doc.data().username;
    userLink.appendChild(username)
    div_user.appendChild(userLink);

    let favoriteIcon = document.createElement("button");

    favoriteIcon.classList.add("favorite-icon");
    let favElement = document.createElement("img");
    favElement.src = '/assets/common/heart.svg';
    if (userFavourites) {
        if (userFavourites.includes(doc.id)) {
            favElement.src = '/assets/common/heart-filled.svg'
        }
    }
    favElement.classList.add("fa");
    favElement.classList.add("fa-heart");
    favoriteIcon.appendChild(favElement);
    div_user.appendChild(favoriteIcon);

        /**
     * Add post to favorites function
     */
         favoriteIcon.onclick = async function addToFavorites() {
             console.log('hola');
            const user = await getCurrentUser();
            const imgElement = favoriteIcon.querySelector('img');
            if (favoriteIcon.classList.contains('favorite')){
                const docFavRef = await db.collection('users/' + user.uid + '/favorites').doc(doc.id).delete().then(() => {
                    console.log("Document successfully deleted!");
                    favoriteIcon.classList.remove('favorite');
                    imgElement.src = '/assets/common/heart.svg';
    
                }).catch((error) => {
                    console.error("Error removing document: ", error);
                });
            } else {
            const docFavRef = await db.collection('users/' + user.uid + '/favorites').doc(doc.id).set(doc.data());
            favoriteIcon.classList.add('favorite');
            imgElement.src = '/assets/common/heart-filled.svg';
            }
        }

    

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
    const imgLink = document.createElement('a');
    imgLink.href = `index.html#view-user-profile?id=${doc.data().userID}`;
    let img_user = document.createElement("img");
    img_user.classList.add("dp");
    img_user.src = doc.data().user_uri;
    imgLink.appendChild(img_user);
    div_user.appendChild(imgLink);
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