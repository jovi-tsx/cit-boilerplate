(function () {
  "use strict";

  angular.module("app").run([
    "$rootScope",
    ($rootScope) => {
      $rootScope.$utils.showLoader = (mensagem) => {
        $(".hyper-loading").show();
        $(".hyper-loading-block").show();
        $("#msg-loading").text(mensagem || "Buscando informações");
      };

      $rootScope.$utils.hideLoader = () => {
        $(".hyper-loading").hide();
        $(".hyper-loading-block").hide();
      };
    },
  ]);
})();
