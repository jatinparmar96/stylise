function init() {
  
    showForYou();

    const all = document.getElementById('community-all')
    all.addEventListener('click', showAllPosts);

    const donate = document.getElementById('community-donate')
    donate.addEventListener('click', showDonatePosts);

    const forYou = document.getElementById('community-for-you')
    forYou.addEventListener('click', showForYou);
   
}

/**
 * clears main before showing posts
 * @method clearWrapper
 */
function clearWrapper(){
    const wrapper = document.getElementById("wrapper");
    wrapper.innerHTML="";

}

/**
 * add posts into the wrapper
 * @method addPosts
 * @param
 */
function addPosts(doc){
    let div= document.createElement("div");
    div.classList.add("post");

        let img = document.createElement("img");
        img.src = doc.data().uri;
        div.appendChild(img);

    let div_user = document.createElement("div");
    div_user.classList.add("user-info");

        let img_user = document.createElement("img");
        img_user.classList.add("dp");
        img_user.src = doc.data().user_uri;
        div_user.appendChild(img_user);

        let username = document.createElement("span");
        username.innerHTML = doc.data().username;
        div_user.appendChild(username);

    div.appendChild(div_user);
    
    document.getElementById("wrapper").appendChild(div);
}

/**
 * Show posts that are tagged with account keywords
 * @method showForYou
 */
async function showForYou() {
    const user = await getCurrentUser();

    const userFieldsRef = await db.collection('users').doc(user.uid).get();
   
        const userFields = userFieldsRef.data();
        tags = userFields.tags;

    clearWrapper();

    db.collection("posts").where("userID", "!=", user.uid).where("public", "==", true).where("type", "==", "community").where("keywords", "array-contains-any", tags)
        .get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
            
               addPosts(doc);
                
            });
    });
        

 }

/**
 * Fetch all public-posts type community
 * @method showAllPosts
 */
function showAllPosts() {

    clearWrapper();

    db.collection("posts").where("public", "==", true).where("type", "==", "community")
        .get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
            
                addPosts(doc);
                
            });
    });
}

/**
 * Fetch all public-posts type donation
 * @method showDonatePosts
 */
 function showDonatePosts() {

    clearWrapper();

    db.collection("posts").where("public", "==", true).where("type", "==", "donate-item")
        .get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
            
                addPosts(doc);
                
            });
    });
}

init();
