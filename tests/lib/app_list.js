/*
    Helpers related to app lists. Prominently used in app_list.js.
*/
var constants = helpers.load('constants');

var appListPages = [
    {
        endpoint: '/api/v2/fireplace/multi-search/',
        endpointParams: {
            doc_type: 'webapp', sort: 'reviewed'
        },
        name: 'New',
        path: '/new',
        src: 'new',
    },
    {
        endpoint: '/api/v2/fireplace/multi-search/',
        endpointParams: {
            doc_type: 'webapp'
        },
        name: 'Popular',
        path: '/popular',
        src: 'popular',
    },
    {
        endpoint: '/api/v2/apps/recommend/',
        endpointParams: {
            doc_type: 'webapp'
        },
        name: 'Recommended',
        path: '/recommended',
        src: 'reco',
        noVary: true,
    },
    {
        endpoint: '/api/v2/fireplace/multi-search/',
        endpointParams: {q: 'rotfl'},
        name: 'Search',
        path: '/search?q=rotfl',
        src: 'search'
    },
    {
        endpoint: '/api/v2/fireplace/multi-search/',
        endpointParams: {
            cat: 'games', doc_type: 'webapp',
        },
        name: 'Category',
        path: '/category/games',
        src: 'games-popular'
    },
    {
        endpoint: '/api/v2/account/installed/mine/',
        endpointParams: {_user: 'mocktoken'},
        login: true,
        name: 'Purchases',
        noCache: true,
        noCompatFiltering: true,
        noVary: true,
        path: '/purchases',
        src: 'myapps',
    },
    {
        appLimit: 6,
        endpoint: '/api/v2/fireplace/feed/collections/top-games/',
        name: 'Collection',
        noExpandToggle: true,
        noLoadMore: true,
        path: '/feed/collection/top-games',
        src: 'collection-element',
    },
    {
        appLimit: 6,
        endpoint: '/api/v2/fireplace/feed/brands/fun-games/',
        name: 'Brand',
        noExpandToggle: true,
        noLoadMore: true,
        path: '/feed/editorial/fun-games',
        src: 'branded-editorial-element',
    },
    // {
    //     appLimit: 6,
    //     endpoint: '/api/v2/fireplace/feed/shelves/telefonica-games/',
    //     name: 'Shelf',
    //     noExpandToggle: true,
    //     noLoadMore: true,
    //     path: '/feed/shelf/telefonica-games',
    //     src: 'operator-shelf-element',
    // },
    {
        endpoint: '/api/v2/langpacks/',
        endpointParams: {fxos_version: '2.2'},
        name: 'Langpacks',
        noAppInstall: true,
        noCompatFiltering: true,
        noDetailPage: true,
        noExpandToggle: true,
        noLoadMore: false,
        noModelCache: true,
        path: '/langpacks/2.2',
    }
];


function appNthChild(n) {
    return '.app-list-app:nth-child(' + n + ')';
}


function getAppData(installBtnSel) {
    // Return app data given its install button.
    var app = casper.evaluate(function(installBtnSel) {
        return $(installBtnSel).data('product');
    }, installBtnSel);
    app.UALabel = app.name + ':' + app.id;
    return app;
}


function getEndpointParams(appListPage, extend) {
    var endpointParams = _.extend({
        // Default API parameters to expect, the tests can override them as
        // needed.
        cache: '1', dev: 'desktop', lang: 'en-US',
        limit: constants.APP_LIMIT + '', region: 'us', vary: '0',
    }, appListPage.endpointParams || {});

    if (appListPage.noCache) {
        delete endpointParams.cache;
    }
    if (appListPage.noVary) {
        delete endpointParams.vary;
    }

    return _.extend(endpointParams, extend || {});
}


function waitForAppListPage(appListPage, cb, opts) {
    helpers.startCasper(_.extend({path: appListPage.path}, opts || {}));
    if (appListPage.login) {
        helpers.waitForPageLoaded(function() {
            helpers.fake_login();
        });
        helpers.waitForLoggedIn();
    }
    casper.waitUntilVisible('.app-list', cb);
}

function waitForLoadMore(cb) {
    return casper.waitUntilVisible('.loadmore .button', function() {
        casper.click('.loadmore .button');
        casper.waitUntilVisible(appNthChild(constants.APP_LIMIT_LOADMORE), cb);
    });
}


module.exports = {
    appListPages: appListPages,
    appNthChild: appNthChild,
    getAppData: getAppData,
    getEndpointParams: getEndpointParams,
    waitForAppListPage: waitForAppListPage,
    waitForLoadMore: waitForLoadMore,
};
