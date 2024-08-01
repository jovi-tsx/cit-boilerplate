(function () {
    "use strict";

    angular.module("app").config(($stateProvider, $urlRouterProvider) => {
        $stateProvider.state({
            name: "index",
            url: "/",
            templateUrl: "/pages/index.html",
            controller: 'ExemploController',
            controllerAs: 'ex'
        });

        // Default URL
        $urlRouterProvider.otherwise("/");
    });
})();
