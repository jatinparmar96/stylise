// ************Firebase Configuration******************************************
// ****************************************************************************

// ************HTML References*************************************************
// ****************************************************************************
const username = document.getElementById('username');
const password = document.getElementById('password');
//event listener
login.addEventListener('click', ()=>{
    ValidateInput();
});

// ************Input validation************************************************
// ****************************************************************************
function isEmptyOrSpaces(str){
    return str === null || str.match(/^ *$/) !== null;
}

function ValidateInput(){
    if (isEmptyOrSpaces(username.value) || isEmptyOrSpaces(password.value)){
        alert("Please don't leave any field empty");
    }
    else {
        AuthenticateUser();
    }
}

// ************User Authentication Process*************************************
// ****************************************************************************
function AuthenticateUser(){
    const dbref = ref(db);

    get(child(dbRef, "UsersList/"+ username.value)).then((snapshot)=>{
        if(snapshot.exists()){
            let dbpassword = decPass(snapshot.val().password);
            if(dbpassword == password.value){
                login();
            } else {
                alert("Wrong username");
            }
        } else {
            alert("username or password is invalid");
        }
    });
}

// ************Password Decription process*************************************
// ****************************************************************************
function decPass(dbpassword){
    let pass = CryptoJS.AES.decrypt(dbpassword, password.value);
    return pass.toString(CryptoJS.enc.Utf8);
}
