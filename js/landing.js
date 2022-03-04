function init() {
    const header = document.getElementById('header');

    hideHeader(header);
    

   
}

function hideHeader (header) {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            header.classList.remove("visually-hidden");
          var uid = user.uid;
          console.log(uid);

        } else {
            header.classList.add("visually-hidden");
        }
      });
      console.log('HideHeader called');

}

init();