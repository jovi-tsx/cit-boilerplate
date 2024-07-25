"use strict";

const app = angular.module("app");

app.factory("RuntimeManagerRepository", [
    "$http",
    function ($http) {
        class RuntimeManagerRepository {
            executeBusinessRuleWithMap(name, params) {
                const { $utils } = $rootScope;

                const data = {
                    ruleName: name,
                    data: params,
                };

                $utils.showLoader();

                return $http
                    .post("/rule", JSON.stringify(data))
                    .then(function (response) {
                        console.log(
                            "Resultado executeBusinessRule:",
                            response.data
                        );

                        return response.data;
                    })
                    .catch((e) => {
                        console.log("Erro executeBusinessRule:", e);
                    })
                    .finally(() => {
                        $utils.hideLoader();
                    });
            }

            executeFlow(name, params) {
                const data = {
                    flowName: name,
                    data: params,
                };

                $utils.showLoader();

                return $http
                    .post("/flow", JSON.stringify(data))
                    .then(function (response) {
                        console.log("Resultado executeFlow:", response.data);
                        return response.data;
                    })
                    .catch((e) => {
                        console.log("Erro executeBusinessRule:", e);
                    })
                    .finally(() => {
                        $rootScope.hideLoader();
                    });
            }

            executeFaaS(name, params) {
                const data = {
                    flowName: name,
                    data: params,
                };

                $rootScope.showLoader();

                return $http
                    .post("/faas", JSON.stringify(data))
                    .then(function (response) {
                        console.log("FAAS", response.data.context);

                        return response.data.context;
                    })
                    .catch((e) => {
                        console.log("Erro executeBusinessRule:", e);
                    })
                    .finally(() => {
                        $rootScope.hideLoader();
                    });
            }

            createOrUpdateList(project, businessObject, list) {
                const data = {
                    project: project,
                    businessObject: businessObject,
                    data: list,
                };

                $rootScope.showLoader();

                return $http
                    .post("/createOrUpdateList", JSON.stringify(data))
                    .then(function (response) {
                        console.log("FAAS", response.data.context);

                        return response.data.context;
                    })
                    .catch((e) => {
                        console.log("Erro executeBusinessRule:", e);
                    })
                    .finally(() => {
                        $rootScope.hideLoader();
                    });
            }
        }

        return new RuntimeManagerRepository();
    },
]);
