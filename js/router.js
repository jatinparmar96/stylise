'use strict';

class Page {
    constructor(name, htmlName, jsName) {
        this.name = name;
        this.htmlName = htmlName;
        // if jsName is not given use html name + .js
        if (!Array.isArray(jsName)) {
            this.jsName = new Array(jsName
                ? jsName
                : htmlName.substring(htmlName.lastIndexOf('/') + 1, htmlName.lastIndexOf('.')) + '.js');
        } else {
            this.jsName = jsName.map(name => name + '.js');
        }

    }
}

class Router {
    static init(mainAreaId, pages) {
        Router.pages = pages;
        Router.rootElem = document.getElementById(mainAreaId);
        window.addEventListener('hashchange', function (e) {
            Router.handleHashChange();
            console.log('route ' + this.window.location.hash);
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
            //append JS part to run.
            if (page.jsName.length) {
                page.jsName.forEach((jsName) => {
                    const script = document.createElement('script');
                    script.setAttribute('src', jsName);
                    script.setAttribute('type', 'text/javascript');
                    Router.rootElem.appendChild(script);
                })
            }


        } catch (error) {
            console.error(error);
        }
    }
}
