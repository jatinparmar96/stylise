
async function init() {
    const postId = getPostIdFromUrl();
    if (postId) {
        const post = await getPostDetails(postId);
        renderPost(post);
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

init();