(function () {
  "use strict";

  angular.module(NGAPP_NAME).run([
    "$rootScope",
    "$filter",
    ($rootScope, $filter) => {
      $rootScope.$utils.maskMoney = (valor, sigla, tamanhoFracao) =>
        $filter("currency")(valor, sigla, tamanhoFracao);
    },
  ]);
})();
