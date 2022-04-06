
const cacheName = "v1";
const urlsToCache = [
    "/pages/index.html",
    "/pages/home.html",
    "/pages/landing-page.html",
    "/pages/login.html",
    "/pages/signup.html",
    "/pages/closet/add-item.html",
    "/pages/closet/category-items.html",
    "/pages/closet/closet.html",
    "/pages/closet/view-item.html",
    "/pages/community/add-post.html",
    "/pages/community/view-post.html",
    "/pages/donate/post-item.html",
    "/pages/profile/update-profile.html",
    "/pages/profile/user-profile.html",
    "/pages/profile/view-user-profile.html",
    "/js/routing/router.js",
    "/js/routing/script.js",
    "/scss/main.css",
];


self.addEventListener('install', event => {
    // it is invoked when the browser installs the service worker
    // here we cache the resources that are defined in the urlsToCache[] array

    // console.log(`[SW] Event fired: ${event.type}`);

    event.waitUntil(				  // waitUntil tells the browser to wait for the passed promise is done
        caches.open(cacheName)		//caches is a global object representing CacheStorage
            .then((cache) => { 			// open the cache with the name cacheName*
                return cache.addAll(urlsToCache);      	// pass the array of URLs to cache. returns a promise
            }));
    //   console.log(`[SW] installed`);
});

self.addEventListener('activate', event => {
    event.waitUntil( // waitUntil tells the browser to wait for this to finish
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if (key !== cacheName) { // compare key with the new cache Name in SW
                    return caches.delete(key);
                }
            }));
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        fetch(event.request).
            catch((error) => {
                console.log(event.request);
                return caches.match(event.request);
            })
    );
});