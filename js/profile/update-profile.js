import {app, db, storage} from "../firebase.js"

let auth;

function init() {
    auth = app.auth();
    const form = document.getElementById('update-profile-form')
    form.addEventListener('submit', handleFormSubmit);
    addCheckboxEventListeners();
    const imgSrc = document.getElementById('img-picker');
    const target = document.getElementById('image')
    addImageChangeListener(imgSrc, target)

}

function addCheckboxEventListeners() {
    const checkboxes = document.querySelectorAll('input[type=checkbox][name*=noTerms]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', handleCheckboxChange)
    })
}

function handleCheckboxChange() {
    //Toggle Inputs,
    toggleInputs(this.checked);

}

function toggleInputs(toggleValue) {
    const inputs = document.querySelectorAll(getInputQuerySelector());
    inputs.forEach(input => {
        input.disabled = toggleValue;
    })
}

function getInputQuerySelector() {
    return `input[class="form-input"],select[class="form-input"]`
}

/**
 * Handle update profile
 * @param event
 * @returns {Promise<void>}
 */
async function handleFormSubmit(event) {
    event.preventDefault();
    let form = document.getElementById('update-profile-form');
    const formData = new FormData(form);
    if (formData.get('profile-image').size) {
        await uploadImageToFireStore(formData.get('profile-image'));
    }
    let values = {}
    formData.forEach((value, key) => {
        // Skip Profile Image, not storing in user Document
        if (key === 'profile-image') {
            return;
        }
        if (key === 'forYouOption[]') {
            let newKey = key.substring(0, key.length - 2);
            values[newKey] = values[newKey] ? [...values[newKey], value] : [value];
        } else {
            values[key] = value;
        }
    })
    await db.collection('users').doc(auth.currentUser.uid).update(values);
    window.location.href = 'index.html#home'
}

function uploadImageToFireStore(file) {
    const submitBtn = document.getElementById('submit-btn')
    const uploadTask = storage.ref().child(`images/${auth.currentUser.uid}`).put(file)
    submitBtn.disabled = true;
    return new Promise((resolve, reject) => {
        uploadTask.on('state_changed',
            (snapshot) => {
                // Observe state change events such as progress, pause, and resume
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                submitBtn.value = `Uploading ${Math.round(progress)}%`;
            },
            (error) => {
                // Handle unsuccessful uploads
            },
            async () => {
                // Handle successful uploads on complete
                // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                const imageUrl = await uploadTask.snapshot.ref.getDownloadURL();
                await setProfileImage(imageUrl)
                resolve();

            })
    });
}

function setProfileImage(imageUrl) {
    const user = auth.currentUser;
    return user.updateProfile({
        photoURL: imageUrl
    });
}

function addImageChangeListener(src, target) {
    const fileReader = new FileReader();
    fileReader.onload = function () {
        target.src = this.result
        target.classList.add('profile-image')
    }
    src.addEventListener('change', function () {
        if (src.files.length) {
            fileReader.readAsDataURL(src.files[0])
        } else {
            target.classList.remove('profile-image');
            target.src = '';
        }

    })
}

init();