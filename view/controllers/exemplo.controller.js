(function () {
  "use strict";

  angular.module("app").controller("ExemploController", [
    "$scope",
    function () {
      const vm = this;

      vm.ola = "Olá!";
    },
  ]);
})();
