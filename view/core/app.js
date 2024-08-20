(function () {
  "use strict";

  const { shadowRoot } = document.body;

  angular.module("app", ["ui.router"]).run([
    "$rootScope",
    ($rootScope) => {
      $rootScope.$utils = {};

      console.log("Módulo 'app' inicializado");
    },
  ]);

  angular.element(document).ready(function () {
    angular.bootstrap(shadowRoot.querySelector("[ng-app]"), ["app"]);
  });
})();
