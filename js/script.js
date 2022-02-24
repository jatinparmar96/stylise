'use strict';

//setting up the Router with pages
Router.init('mainArea', [
    new Page('#landing', '/pages/index.html'), // 1st Page is default if no URL match
    new Page('#about', '/pages/about.html'),
    new Page('#login', '/pages/login.html', ['/js/login']),
    new Page('#register', '/pages/signup.html', ['/js/signup']),
    new Page('#home', '/pages/home.html', ['/js/home']),
    new Page('#update-profile', '/pages/profile/update-profile.html', ['/js/profile/update-profile']),
    new Page('#closet', '/pages/closet.html', ['/js/closet'])

    // add new pages here
]);
