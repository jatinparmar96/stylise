'use strict';

//setting up the Router with pages
Router.init('mainArea', [
    new Page('#', '/pages/landing-page.html', ['/js/landing']), // 1st Page is default if no URL match
    new Page('#about', '/pages/about.html'),
    new Page('#login', '/pages/login.html', ['/js/login']),
    new Page('#register', '/pages/signup.html', ['/js/signup']),
    new Page('#home', '/pages/home.html', ['/js/home', '/js/community/community']),
    new Page('#update-profile', '/pages/profile/update-profile.html', ['/js/profile/update-profile']),
    new Page('#user-profile', '/pages/profile/user-profile.html', ['/js/profile/user-profile']),
    new Page('#view-user-profile', '/pages/profile/view-user-profile.html', ['/js/profile/view-user-profile']),
    new Page('#closet/add-item', '/pages/closet/add-item.html', ['/js/closet/add-item']),
    new Page('#closet', '/pages/closet/closet.html', ['/js/closet/closet']),
    new Page('#category', '/pages/closet/add-item.html', ['/js/closet/add-item']),
    new Page('#closet/add-item', '/pages/closet/add-item.html', ['/js/closet/add-item']),
    

    // Community Routes
    new Page('#community/add-post', '/pages/community/add-post.html', ['/js/community/add-post']),
    new Page('#donate/post-item', '/pages/donate/post-item.html', ['/js/donate/post-item']),

    new Page('#view-post', '/pages/community/view-post.html', ['/js/community/view-post'])

    // add new pages here
]);
