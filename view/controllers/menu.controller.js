(function () {
  "use strict";

  angular.module("app").controller("MenuController", [
    "routes",
    function (routes) {
      const vm = this;

      vm.routes = routes;
    },
  ]);
})();
