(function () {
  "use strict";

  window.NGAPP_NAME = document.querySelector("[ng-app]").getAttribute("ng-app");

  angular.module(NGAPP_NAME, ["ui.router"]).run(($rootScope) => {
    $rootScope.$utils = {};

    console.log("Módulo 'app' inicializado");
  });
})();
