/**
 * Uploads Image to firestorage and returns a ref to uploaded object.
 * @returns {Promise<unknown>}
 */
 async function donateItemImg(imgItem) {
    const currentDate = new Date();
    const storageRef = storage.ref();
    const userID = auth.currentUser.uid;
    const closetRef = storageRef.child("donate/" + userID + "/" + currentDate.getTime());// reference to user storage folder
    return new Promise((resolve, reject) => {
        try {
            closetRef.put(imgItem).then((snapshot) => {
                document.getElementById('image-input').value = null;
                resolve(snapshot);

            })
        }
        catch (error) {
            console.log(error.code);
            reject();
        }
    })
}

/**
 * Handle save btn
 *  @returns {Promise<void>}
 */
 async function uploadItemDesc(event) {
    event.preventDefault();
    const category = document.getElementById('categories').value;
    const keywords = document.getElementById('keywords').value;
    const imageItem = document.getElementById('image-input').files[0]; //image selected to upload by user
    if (!imageItem) {
            return;
    }
    const imageRef = await donateItemImg(imageItem);
    const imageUrl = await imageRef.ref.getDownloadURL()
    console.log(keywords)
        const itemObject = {
            category,
            keywords: keywords.split(','),
            uri: imageUrl,
            type: 'donate-item',
            public: true
        };
        const docRef = await db.collection('posts').add(itemObject);
}