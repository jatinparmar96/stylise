function init() {
    const addCategoryForm = document.getElementById('add-category-form');
    addCategoryForm.addEventListener('submit', handleFormSubmit);
    updateUsername();
}

function updateUsername() {
    auth.onAuthStateChanged((user) => {
        if (user) {
            document.getElementById('username').innerHTML = user.displayName;
            listenToCategory();
        }
    })
}

async function handleFormSubmit(event) {
    event.preventDefault();
    const user = auth.currentUser;
    const categoryName = document.getElementById('category-name').value;
    await db.collection('categories').add({
        user: user.uid,
        category: categoryName
    })
    alert('category Added Successfully');
}

function listenToCategory() {
    const user = auth.currentUser;

    const listener = db.collection("categories").where("user", "==", user.uid).onSnapshot((querySnapshot) => {
            const closeList = document.getElementById('closetList');
            closeList.innerHTML = '';
            querySnapshot.forEach((doc) => {
                closeList.innerHTML += renderCloseCard(doc);
            });
    });
    window.removeFirebaseListener.push(listener);
}

function renderCloseCard(categoryDocument) {
    const categoryId = categoryDocument.id;
    const categoryData = categoryDocument.data();
    return `
    <div class="flex flex-column category-wrapper" >
        <a href="index.html#category?q=${categoryId}">

            <span>${categoryData.category}</span>
        </a>
    </div>
    `;
}

init();