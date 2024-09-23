(function () {
  "use strict";

  angular.module(NGAPP_NAME).component("layout", {
    templateUrl: "/html/forms/layout.html",
    controller: function ($scope, $compile) {
      angular.element(document).ready(function () {
        this.$postLink = function () {
          const shadowContent = document.querySelector("[shadow-template]");

          const shadowAngularApp = document.querySelector(
            "[shadow-angular-app]"
          );

          $scope.shadowRoot = shadowAngularApp.attachShadow({ mode: "open" });
          $scope.shadowRoot.innerHTML = shadowContent.innerHTML;

          shadowContent.remove();

          $compile($scope.shadowRoot)($scope);
        };
      });
    },
  });
})();
