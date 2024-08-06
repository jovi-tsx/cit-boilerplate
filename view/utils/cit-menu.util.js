(function () {
  "use strict";

  angular.element(document).ready(function () {
    angular.module("app").run([
      "$rootScope",
      ($rootScope) => {
        $rootScope.track = false;
      },
    ]);
  });
})();
