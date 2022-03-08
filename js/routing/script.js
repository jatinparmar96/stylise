'use strict';

//setting up the Router with pages
Router.init('mainArea', [
    new Page('#', '/pages/landing-page.html', ['/js/landing']), // 1st Page is default if no URL match
    new Page('#about', '/pages/about.html'),
    new Page('#login', '/pages/login.html', ['/js/login']),
    new Page('#register', '/pages/signup.html', ['/js/signup']),
    new Page('#home', '/pages/home.html', ['/js/home', '/js/community/community']),
    new Page('#update-profile', '/pages/profile/update-profile.html', ['/js/profile/update-profile']),
    new Page('#closet', '/pages/closet/closet.html', ['/js/closet/closet']),
    new Page('#category', '/pages/closet/add-item.html', ['/js/closet/add-item']),
    new Page('#closet/add-item', '/pages/closet/add-item.html', ['/js/closet/add-item'])
    // add new pages here
]);
