(function () {
    "use strict";

    angular.element(document).ready(function () {
        angular.module("app").run([
            "$rootScope",
            "$filter",
            ($rootScope, $filter) => {
                $rootScope.$utils.maskMoney = (valor, sigla, tamanhoFracao) =>
                    $filter("currency")(valor, sigla, tamanhoFracao);
            },
        ]);
    });
})();
