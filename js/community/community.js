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
            let current = document.getElementsByClassName("active");
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

    if (all.classList.contains("active")){
        showAllPosts();
    }
    else if (donate.classList.contains("active")){
        showDonatePosts();
    }
    else {
    // Loop through the buttons and add the active class to the current/clicked button
        for (let i = 0; i < btns.length; i++) {
            if (btns[i].classList.contains("active") ){
                btns[i].classList.remove("active");
            }
        }
        all.classList += " active";
        showAllPosts();
    }

    if(document.getElementById('cancelSearch')){
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
    else if (donate.classList.contains("active")){
        showDonatePosts();
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

    const all = document.getElementById('community-all');
    const forYou = document.getElementById('community-for-you');
    let favoriteIcon = document.createElement("button");

    if (all.classList.contains('active') || forYou.classList.contains('active')) {
        favoriteIcon.classList.add("favorite-icon");
        let favElement = document.createElement("i");
        favElement.classList.add("fa");
        favElement.classList.add("fa-heart");
        favoriteIcon.appendChild(favElement);
    }
    /**
     * Add post to favorites function
     */
    favoriteIcon.onclick = async function addToFavorites() {
        console.log(`${doc.id} added to favorites`);
        const user = await getCurrentUser();
        const docFavRef = await db.collection('users/' + user.uid + '/favorites').doc(doc.id).set(doc.data());

    }
    div_user.appendChild(favoriteIcon);

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
    clearWrapper();
    // fetch posts from "posts" collection with conditions
    db.collection("posts").where("userID", "!=", user.uid).where("public", "==", true).where("type", "==", "community").where("keywords", "array-contains-any", tags)
        .get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                addPosts(doc);
            });
            hideLoader();
        });

    if (document.getElementById('cancelSearch')){
        document.getElementById('searchInput').value = "";
        const cancelSearchBtn = document.getElementById('cancelSearch');
        cancelSearchBtn.remove();
    }
}

/**
 * Fetch all public-posts type community
 * @method showAllPosts
 */
async function showAllPosts() {
    showLoader();
    const user = await getCurrentUser();
    const searchInput = document.getElementById('searchInput');
    const searchValue = searchInput.value;
    const searchMessage = document.getElementById('searchMessage');
    clearWrapper();
    if (searchValue.trim().length > 1){
        console.log(searchValue);
        db.collection("posts").where("userID", "!=", user.uid).where("public", "==", true).where("type", "==", "community").where("keywords", "array-contains", searchValue)
        .get().then((querySnapshot) => {
            if (querySnapshot.empty){
                searchMessage.innerHTML = "<p>No results were found for <strong>"+searchValue+"</strong></p>";
            }
            else {
                searchMessage.innerHTML = "<p>Results for <strong>"+searchValue+"</strong></p>";
                querySnapshot.forEach((doc) => {
                addPosts(doc);
            });
        }
        });
    }
    else {
    // fetch all posts from "posts" collection
    searchMessage.innerHTML = "";
    db.collection("posts").where("userID", "!=", user.uid).where("public", "==", true).where("type", "==", "community")
        .get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                addPosts(doc);
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
                addPosts(doc);
            });
            hideLoader();
        });
    if (document.getElementById('cancelSearch')){
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
    if (searchValue.trim().length > 1){
        console.log(searchValue);
        db.collection("posts").where("userID", "!=", user.uid).where("public", "==", true).where("type", "==", "donate-item").where("tags", "array-contains", searchValue)
        .get().then((querySnapshot) => {
            if (querySnapshot.empty){
                searchMessage.innerHTML = "<p>No results were found for <strong>"+searchValue+"</strong></p>";
            }
            else {
                let donateDocsArray = [];
                searchMessage.innerHTML = "<p>Results for <strong>"+searchValue+"</strong></p>";
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
    db.collection("posts").where("userID", "!=", user.uid).where("public", "==", true).where("type", "==", "donate-item")
        .get().then((querySnapshot) => {
            let donateDocsArray = [];
            querySnapshot.forEach((doc) => {
                donateDocsArray.push(
                    {
                        ...doc.data(), id: doc.id
                    }
                );
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
            donateDocsArray.forEach(item => {
                wrapper.innerHTML += renderDonateItems(item);

            })
            hideLoader();
        });
    }
}

function renderDonateItems(item) {
    console.log(item);
    return `
    <div class="post">
        <a href="index.html#view-post?id=${item.id}">
            <img src="${item.uri}">
        </a>
        <div class="user-info">
            <img class="dp" src="${item.user_uri}">
            <a href="index.html#view-user-profile?id=${item.userID}"> 
                <span>${item.username}</span>
            </a>
        </div>
    </div>
    `
}
init();
