(function () {
  "use strict";

  angular.module(NGAPP_NAME).run([
    "$rootScope",
    ($rootScope) => {
      $rootScope.track = false;
    },
  ]);
})();
