(function () {
  "use strict";

  angular.module(NGAPP_NAME).controller("MenuController", [
    "routes",
    function (routes) {
      const vm = this;

      vm.routes = routes;
    },
  ]);
})();
