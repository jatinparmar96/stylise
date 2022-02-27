'use strict';

class Page {
    constructor(name, htmlName, jsName) {
        this.name = name;
        this.htmlName = htmlName;
        if (Array.isArray(jsName)) {
            this.jsName = jsName.map(name => name + '.js');
        }
        else {
            this.jsName = [];
        }

    }
}

class Router {
    static init(mainAreaId, pages) {
        Router.pages = pages;
        Router.rootElem = document.getElementById(mainAreaId);
        window.addEventListener('hashchange', function (e) {
            Router.handleHashChange();
           
        });
        Router.handleHashChange();
    }

    static handleHashChange() {
        const urlHash = window.location.hash;
        if (urlHash.length > 0) {
            // If there is a hash in URL
            for (let i = 0; i < Router.pages.length; i++) {
                // find which page matches the hash then navigate to it
                if (urlHash === Router.pages[i].name) {
                    Router.goToPage(Router.pages[i]);
                    break;
                }
            }
        } else {
            // If no hash in URL, load the first Page as the default page
            Router.goToPage(Router.pages[0]);
        }
    }

    static async goToPage(page) {
        try {
            const response = await fetch(page.htmlName);
            Router.rootElem.innerHTML = await response.text();
            console.log(page);
            //append JS part to run.
            if (page.jsName.length) {
                page.jsName.forEach((jsName) => {
                    const script = document.createElement('script');
                    script.setAttribute('src', jsName);
                    script.setAttribute('type', 'text/javascript');
                    // script.onload = function () {
                    //     window[jsName]();
                    // }
                    Router.rootElem.appendChild(script);
                })
            }


        } catch (error) {
            console.error(error);
        }
    }
}
