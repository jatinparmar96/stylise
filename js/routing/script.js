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

    

    // Community Routes
    new Page('#community/add-post', '/pages/community/add-post.html', ['/js/community/add-post']),
    new Page('#donate/post-item', '/pages/donate/post-item.html', ['/js/donate/post-item']),

    new Page('#view-post', '/pages/community/view-post.html', ['/js/community/view-post']),

    // Closet Routes
    new Page('#closet/add-item', '/pages/closet/add-item.html', ['/js/closet/add-item']),
    new Page('#closet', '/pages/closet/closet.html', ['/js/closet/closet']),
    new Page('#category', '/pages/closet/category-items.html', ['/js/closet/category-items']),
    new Page('#closet/add-item', '/pages/closet/add-item.html', ['/js/closet/add-item']),
    new Page('#view-item', '/pages/closet/view-item.html', ['/js/closet/view-item' ]),

    // add new pages here
]);
