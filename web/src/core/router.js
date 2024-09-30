(function () {
  "use strict";

  angular
    .module(NGAPP_NAME)
    .constant("routes", [
      {
        name: "Home",
        url: "/",
        templateUrl: "/html/pages/index.html",
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
