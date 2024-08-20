(function () {
  "use strict";

  angular.module("app").run([
    "$rootScope",
    ($rootScope) => {
      $rootScope.track = false;
    },
  ]);
})();
