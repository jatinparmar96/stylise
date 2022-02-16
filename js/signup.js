// const registerForm = document.getElementById('registerForm');

// /**
//  * @class RegisterForm
//  * @property firstName:string
//  * @property lastName:string
//  * @property email:string
//  * @property password:string
//  * @property confirmPassword:string
//  * @property keywords:string
//  */
// class RegisterForm {
//     constructor(firstName, lastName, email, password, confirmPassword, keywords) {
//         this.firstName = firstName;
//         this.lastName = lastName;
//         this.email = email;
//         this.password = password;
//         this.confirmPassword = confirmPassword;
//         this.keywords = keywords;
//     }

//     /**
//      * TODO: Add password length check
//      * @return {boolean}
//      */
//     isPasswordValid() {
//         return this.password === this.confirmPassword;
//     }
// }

// /**
//  * Handle the Register Form Submit Event
//  * @method handleSubmitForm
//  * @return {void};
//  * @param event:Event
//  */
// const handleSubmitForm = (event) => {
//     event.preventDefault();
//     const firstName = document.getElementById('firstName');
//     const lastName = document.getElementById('lastName');
//     const email = document.getElementById('email');
//     const password = document.getElementById('password');
//     const confirmPassword = document.getElementById('confirmPassword');
//     const keywords = document.getElementById('keywords');

//     const formData = new RegisterForm(firstName, lastName, email, password, confirmPassword, keywords);
//     if (formData.isPasswordValid()) {
//         submitForm(formData)
//     } else {
//         alert("Password Mismatch")
//     }
// }

// /**
//  * TODO: Submit validated Form
//  */
// function submitForm(formData) {
//     console.error("Method not Implemented")
// }

// //Register Event Listeners
// registerForm.addEventListener('submit', handleSubmitForm);

firebase.auth().onAuthStateChanged(user => {
    if (user) {
        window.location.href = 'home-page/index.html'
    } else {
    }
});