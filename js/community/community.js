function init() {

    const all = document.getElementById('community-all')
    all.addEventListener('click', showAllPosts);

    const donate = document.getElementById('community-donate')
    donate.addEventListener('click', showDonatePosts);
    
    getTags();





    
}


function getTags() {
    let tagsArr = [];
    firebase.auth().onAuthStateChanged(user => {
     let uid = user.uid;
    db.collection("users").doc(uid)
        .get().then((doc)=> {
            let tags =doc.data().tags;
            tagsArr = tags.split(" ");
            console.log(tagsArr);
            
            
        })

    })
    
}

/**
 * Fetch all public-posts type community
 * @method showAllPosts
 */
function showAllPosts() {
    const wrapper = document.getElementById("wrapper");
    wrapper.innerHTML="";
    db.collection("posts").where("public", "==", true).where("type", "==", "community")
        .get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
            
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
                
            });
    });
}

/**
 * Fetch all public-posts type donation
 * @method showDonatePosts
 */
 function showDonatePosts() {
    const wrapper = document.getElementById("wrapper");
    wrapper.innerHTML="";
    db.collection("posts").where("public", "==", true).where("type", "==", "donate-item")
        .get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
            
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
                
            });
    });
}

init();

init();