angular.module("app").config(($stateProvider, $urlRouterProvider) => {
    $stateProvider.state({
        name: "index",
        url: "/",
        templateUrl: "/pages/index.html",
    });

    // Default URL
    $urlRouterProvider.otherwise("/");
});
