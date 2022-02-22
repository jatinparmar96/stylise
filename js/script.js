'use strict';

//setting up the Router with pages
Router.init('mainArea', [
    new Page('#landing', '/pages/index.html'), // 1st Page is default if no URL match
    new Page('#about', '/pages/about.html'),
    new Page('#login', '/pages/login.html', ['/js/login', '/js/authentication']),
    new Page('#register', '/pages/signup.html', ['/js/authentication']),
    new Page('#home', '/pages/home.html', ['/js/home'])

    // add new pages here
]);
