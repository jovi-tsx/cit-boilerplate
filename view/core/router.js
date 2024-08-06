(function () {
  "use strict";

  angular
    .module("app")
    .constant("routes", [
      {
        name: "Home",
        url: "/",
        templateUrl: "/pages/index.html",
        controller: "ExemploController",
        controllerAs: "ex",
      },
      // Adicione mais rotas conforme necessário
    ])
    .config([
      "$stateProvider",
      "$urlRouterProvider",
      "routes",
      function ($stateProvider, $urlRouterProvider, routes) {
        routes.forEach((route) => {
          $stateProvider.state(route);
        });

        // Default URL
        $urlRouterProvider.otherwise("/");
      },
    ]);
})();
