
// fetch all public-posts
db.collection("posts").where("public", "==", true)
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
            console.log(doc.id, " => ", doc.data());
        });
});
