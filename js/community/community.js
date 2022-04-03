function init() {
    //When load show For You by default
    showForYou();
    //Show Loader

    //Handle Community All
    const all = document.getElementById('community-all')
    all.addEventListener('click', showAllPosts);
    //Handle Community Donate
    const donate = document.getElementById('community-donate')
    donate.addEventListener('click', showDonatePosts);
    //Handle Community For You
    const forYou = document.getElementById('community-for-you')
    forYou.addEventListener('click', showForYou);
    //Handle community favorite
    const favorite = document.getElementById('community-favourite')
    favorite.addEventListener('click', showFavorite);
    //Handle search
    const searchBtn = document.getElementById('searchBtn')
    searchBtn.addEventListener('click', showSearchResults);

    /**
     * identify active home tab
     */
    // Get the container element
    let btnContainer = document.getElementById("community-nav-list");

    // Get all buttons with class="nav-btn" inside the container
    let btns = btnContainer.getElementsByClassName("nav-btn");

    // Loop through the buttons and add the active class to the current/clicked button
    for (let i = 0; i < btns.length; i++) {
        btns[i].addEventListener("click", function () {
            let current = btnContainer.getElementsByClassName("active");
            current[0].className = current[0].className.replace(" active", "");
            this.className += " active";
        });
    }
}

/**
 * clears main before showing posts
 * @method clearWrapper
 */
function clearWrapper() {
    const wrapper = document.getElementById("wrapper");
    wrapper.innerHTML = "";
}

/**
 * show search results in community pages
 * 
 */
function showSearchResults() {
    clearWrapper();
    const all = document.getElementById('community-all');
    const donate = document.getElementById('community-donate');
    let btnContainer = document.getElementById("community-nav-list");

    // Get all buttons with class="nav-btn" inside the container
    let btns = btnContainer.getElementsByClassName("nav-btn");

    if (all.classList.contains("active")) {
        showAllPosts();
    }
    else if (donate.classList.contains("active")) {
        showDonatePosts();
    }
    else {
        // Loop through the buttons and add the active class to the current/clicked button
        for (let i = 0; i < btns.length; i++) {
            if (btns[i].classList.contains("active")) {
                btns[i].classList.remove("active");
            }
        }
        all.classList += " active";
        showAllPosts();
    }

    if (document.getElementById('cancelSearch')) {
        console.log("Cancel button already exists");
    }
    else {
        let cancelBtn = document.createElement("button");
        cancelBtn.classList.add("cancelSearch");
        cancelBtn.id = "cancelSearch";
        document.getElementById('search').appendChild(cancelBtn);
        const cancelSearchBtn = document.getElementById('cancelSearch');
        cancelSearchBtn.innerHTML = "cancel";
    }
    document.getElementById('cancelSearch').addEventListener('click', cancelSearch);
}

/**
 * 
 * cancel search and show all posts or donate posts
 */
function cancelSearch() {
    document.getElementById('searchInput').value = "";
    const cancelSearchBtn = document.getElementById('cancelSearch');
    cancelSearchBtn.remove();
    const all = document.getElementById('community-all');
    const donate = document.getElementById('community-donate');

    if (all.classList.contains("active")) {
        showAllPosts();
    }
    else if (donate.classList.contains("active")) {
        showDonatePosts();
    }
}


/**
 * add posts into the wrapper
 * @method addPosts
 * @param
 */
function addPosts(doc, index = 0, userFavourites = undefined) {
    let div = document.createElement("div");
    div.classList.add("post");

    const postLink = document.createElement('a');
    postLink.href = `index.html#view-post?id=${doc.id}`;
    postLink.classList.add('post-image');
    let img = document.createElement("img");
    img.src = doc.data().uri;
    postLink.appendChild(img)
    div.appendChild(postLink);
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

    // Create a link
    const userLink = document.createElement('a');
    userLink.href = `index.html#view-user-profile?id=${doc.data().userID}`;
    username.innerHTML = doc.data().username;
    userLink.appendChild(username)

    const userMetaDataDiv = document.createElement('div');
    userMetaDataDiv.appendChild(userLink);
    userMetaDataDiv.classList.add('user-meta');

    div_user.appendChild(userMetaDataDiv);

    const all = document.getElementById('community-all');
    const forYou = document.getElementById('community-for-you');
    let favoriteIcon = document.createElement("button");
    div.style.animationDelay = `${index * 100}ms`;
    div.classList.add('fade-in-fwd');

    if (all.classList.contains('active') || forYou.classList.contains('active')) {

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
        userMetaDataDiv.appendChild(favoriteIcon);
    }
    /**
     * Add post to favorites function
     */
    favoriteIcon.onclick = async function addToFavorites() {
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


    div.appendChild(div_user);
    document.getElementById("wrapper").appendChild(div);
}

/**
 * Show posts that are tagged with account keywords
 * @method showForYou
 */
async function showForYou() {
    const searchMessage = document.getElementById('searchMessage');
    searchMessage.innerHTML = "";
    showLoader();

    const user = await getCurrentUser();
    // Get user tags
    const userFieldsRef = await db.collection('users').doc(user.uid).get();
    const userFields = userFieldsRef.data();
    tags = userFields.tags;
    const userFavourites = await getUserFavorites(user.uid)
    clearWrapper();
    // fetch posts from "posts" collection with conditions
    db.collection("posts").where("userID", "!=", user.uid).where("public", "==", true).where("type", "==", "community").where("keywords", "array-contains-any", tags)
        .get().then((querySnapshot) => {
            let index = 0
            querySnapshot.forEach((doc) => {
                addPosts(doc, index, userFavourites);
                index++;
            });
            hideLoader();
        });

    if (document.getElementById('cancelSearch')) {
        document.getElementById('searchInput').value = "";
        const cancelSearchBtn = document.getElementById('cancelSearch');
        cancelSearchBtn.remove();
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
 * Fetch all public-posts type community
 * @method showAllPosts
 */
async function showAllPosts() {
    showLoader();
    const user = await getCurrentUser();
    const searchInput = document.getElementById('searchInput');
    const searchValue = searchInput?.value;
    const searchMessage = document.getElementById('searchMessage');
    const userFavourites = await getUserFavorites(user.uid)

    clearWrapper();
    if (searchValue?.trim().length > 1) {
        db.collection("posts").where("userID", "!=", user.uid).where("public", "==", true).where("type", "==", "community").where("keywords", "array-contains", searchValue)
            .get().then((querySnapshot) => {
                if (querySnapshot.empty) {
                    searchMessage.innerHTML = "<p>No results were found for <strong>" + searchValue + "</strong></p>";
                }
                else {
                    searchMessage.innerHTML = "<p>Results for <strong>" + searchValue + "</strong></p>";
                    let index = 0
                    querySnapshot.forEach((doc) => {
                        addPosts(doc, index, userFavourites);
                        index++;
                    });
                }
                hideLoader();
            });
    }
    else {
        // fetch all posts from "posts" collection
        db.collection("posts").orderBy("timeStamp", "desc").where("public", "==", true).where("type", "==", "community")
            .get().then((querySnapshot) => {
                let index = 0;
                querySnapshot.forEach((doc) => {
                    if(doc.data().userID != user.uid){
                    addPosts(doc, index, userFavourites);
                    index++
                    }
                });
                hideLoader();
            });
    }
}

/**
 * Fetch all favorite posts
 * 
 */
async function showFavorite() {
    showLoader();
    const user = await getCurrentUser();
    clearWrapper();
    const searchMessage = document.getElementById('searchMessage');
    searchMessage.innerHTML = "";
    // fetch all posts from "favorites" collection
    db.collection("users/" + user.uid + "/favorites")
        .get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                addFavoritePosts(doc);
            });
            hideLoader();
        });
    if (document.getElementById('cancelSearch')) {
        document.getElementById('searchInput').value = "";
        const cancelSearchBtn = document.getElementById('cancelSearch');
        cancelSearchBtn.remove();
    }
}

/**
 * Fetch all public-posts type donation
 * @method showDonatePosts
 */
async function showDonatePosts() {
    // Setting distance to 10KM for now.
    const distance = 10;
    showLoader();
    const user = await getCurrentUser();
    const searchInput = document.getElementById('searchInput');
    const searchValue = searchInput.value;
    const searchMessage = document.getElementById('searchMessage');
    clearWrapper();
    const userMetaDataDoc = await db.collection('users').doc(user.uid).get()
    const userMetaData = userMetaDataDoc.data();
    if (searchValue.trim().length > 1) {
        db.collection("posts").where("userID", "!=", user.uid).where("public", "==", true).where("type", "==", "donate-item").where("tags", "array-contains", searchValue)
            .get().then((querySnapshot) => {
                if (querySnapshot.empty) {
                    searchMessage.innerHTML = "<p>No results were found for <strong>" + searchValue + "</strong></p>";
                }
                else {
                    let donateDocsArray = [];
                    searchMessage.innerHTML = "<p>Results for <strong>" + searchValue + "</strong></p>";
                    querySnapshot.forEach((doc) => {
                        donateDocsArray.push(
                            {
                                ...doc.data(), id: doc.id
                            }
                        );
                        //addPosts(doc);
                        const wrapper = document.getElementById("wrapper");
                        donateDocsArray.forEach(item => {
                            wrapper.innerHTML += renderDonateItems(item);

                        })
                    });
                }
            });
    }
    else {
        searchMessage.innerHTML = "";
        // fetch posts from "posts" collection with type = donate-item
        db.collection("posts").orderBy("timeStamp", "desc").where("public", "==", true).where("type", "==", "donate-item")
            .get().
            then((querySnapshot) => {
                let donateDocsArray = [];
                querySnapshot.forEach((doc) => {
                    if (doc.data().userID != user.uid) {
                        donateDocsArray.push(
                            {
                                ...doc.data(), id: doc.id
                            }
                        );
                    };
                });
                donateDocsArray = donateDocsArray.filter((item) => {
                    if (item.location.coords) {

                        if (!userMetaData.locationCoords?.latitude
                            || userMetaData.locationCoords?.longitude
                        ) {
                            return true;
                        }
                        const coordsDistance = distanceBetweenCoords(
                            userMetaData.locationCoords?.latitude,
                            userMetaData.locationCoords?.longitude,
                            item.location.coords.latitude,
                            item.location.coords.longitude
                        )
                        if (Math.round(coordsDistance) <= distance) {
                            return true;
                        }
                        else {
                            return false;
                        }
                    }
                    return false;
                });
                const wrapper = document.getElementById("wrapper");
                donateDocsArray.forEach((item, idx) => {
                    wrapper.innerHTML += renderDonateItems(item, idx);

                })
            })
    }
    hideLoader();
}


function renderDonateItems(item, idx = 0) {
    return `
    <div class="post fade-in-fwd" style="animation-delay: ${idx * 100}ms">
        <a href="index.html#view-post?id=${item.id}" class="post-image">
            <img src="${item.uri}">
        </a>
        <div class="user-info">
            <a href="index.html#view-user-profile?id=${item.userID}"> 
            <img class="dp" src="${item.user_uri}">
            </a>
            <div class="user-meta">
            <a href="index.html#view-user-profile?id=${item.userID}"> 
                <span>${item.username}</span>
            </a>
            </div>
        </div>
    </div>
    `
}


/**
 * add posts into the wrapper
 * @method addFavoritePosts
 * @param
 */
 function addFavoritePosts(doc, index = 0) {
    let div = document.createElement("div");
    div.classList.add("post");

    const postLink = document.createElement('a');
    postLink.href = `index.html#view-post?id=${doc.id}`;
    postLink.classList.add('post-image');
    let img = document.createElement("img");
    img.src = doc.data().uri;
    postLink.appendChild(img)
    div.appendChild(postLink);
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

    // Create a link
    const userLink = document.createElement('a');
    userLink.href = `index.html#view-user-profile?id=${doc.data().userID}`;
    username.innerHTML = doc.data().username;
    userLink.appendChild(username)

    const userMetaDataDiv = document.createElement('div');
    userMetaDataDiv.appendChild(userLink);
    userMetaDataDiv.classList.add('user-meta');

    div_user.appendChild(userMetaDataDiv);

    const all = document.getElementById('community-all');
    const forYou = document.getElementById('community-for-you');
    let favoriteIcon = document.createElement("button");
    favoriteIcon.classList.add("favorite");
    div.style.animationDelay = `${index * 100}ms`;
    div.classList.add('fade-in-fwd');



        favoriteIcon.classList.add("favorite-icon");
        let favElement = document.createElement("img");
        favElement.src = '/assets/common/heart-filled.svg';
        favElement.classList.add("fa");
        favElement.classList.add("fa-heart");
        favoriteIcon.appendChild(favElement);
        userMetaDataDiv.appendChild(favoriteIcon);


    div.appendChild(div_user);
    document.getElementById("wrapper").appendChild(div);
        /**
     * Add post to favorites function
     */
         favoriteIcon.onclick = async function addToFavorites() {
            const user = await getCurrentUser();
            const imgElement = favoriteIcon.querySelector('img');
            if (favoriteIcon.classList.contains('favorite')){
                const docFavRef = await db.collection('users/' + user.uid + '/favorites').doc(doc.id).delete().then(() => {
                    console.log("Document successfully deleted!");
                    favoriteIcon.classList.remove('favorite');
                    imgElement.src = '/assets/common/heart.svg';
                    div.remove();
    
                }).catch((error) => {
                    console.error("Error removing document: ", error);
                });
            } else {
            const docFavRef = await db.collection('users/' + user.uid + '/favorites').doc(doc.id).set(doc.data());
            favoriteIcon.classList.add('favorite');
            imgElement.src = '/assets/common/heart-filled.svg';
            }
        }
}
init();
