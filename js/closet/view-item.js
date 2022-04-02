async function init() {
    //console.log('test')
    const postId = getPostIdFromUrl();
    if (postId) {
        console.log(postId);
        const post = await getPostDetails(postId);
        renderPost(post);
    }
}

/**
 * Get item Id parameter from the url.
 * @returns string
 */
function getPostIdFromUrl() {
    return window.location.href.split('?')[1].split('=')[1];
}


/**
 * Get Item Details for a given post ID from firebase
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
    const postTags = document.getElementById('postTags');

    // postImg.src = post.data().uri;
    const imgContainer = document.getElementById("image-container");
    imgContainer.style.backgroundImage = `url(${post.data().uri})`;
    if (post.data().keywords?.length) {
        post.data().keywords.forEach(tag => {
            postTags.innerHTML += `<span>#${tag}</span>`;
        })
    }
  

}

init();