
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
    // it is invoked after the service worker completes its installation. 
    // It's a place for the service worker to clean up from previous SW versions
    // console.log(`[SW] Event fired: ${event.type}`);

    // console.log(`[SW] activated`);
});

self.addEventListener('fetch', event => {
    // Fires whenever the app requests a resource (file or data)  normally this is where the service worker would check to see
    // if the requested resource is in the local cache before going to the server to get it. 
    // console.log(`[SW] Fetch event for ${event.request.url}`);

    //1. No Strategy, simply forward the request to server (i.e. No Offline Capability)
    event.respondWith((async () => {
        try {
            return fetch(event.request)
        }
        catch (e) {
            const response = await caches.match(event.request);
            console.log(response);
            return response;
        }
    })());



});