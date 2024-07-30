(function () {
    "use strict";

    angular.module("app").factory("DataObjectAccess", [
        "RuntimeManagerRepository",
        function (RuntimeManagerRepository) {
            async function executeFaaS(serviceName, map) {
                const spark = new Object({
                    params: {
                        execute: serviceName,
                    },
                    ...(map && {
                        data: map,
                    }),
                });

                const execute = await RuntimeManagerRepository.executeFaaS(
                    "DataObjectAccessService",
                    spark
                );

                return execute.context.response;
            }

            async function executeContractRule(serviceName, map) {
                const spark = new Object({
                    execute: serviceName,
                    ...(map
                        ? {
                              params: map,
                          }
                        : {
                              params: new Object(),
                          }),
                });

                const execute =
                    await RuntimeManagerRepository.executeBusinessRuleWithMap(
                        "ContractRuleService",
                        spark
                    );

                return execute.response;
            }

            async function executeContractTimeline(params) {
                const spark = new Object({
                    ...(params && Object.keys(params).length
                        ? {
                              params: params,
                          }
                        : {
                              params: new Object(),
                          }),
                });

                const execute = await RuntimeManagerRepository.executeFlow(
                    "ContractTimelineService",
                    spark
                );

                return execute.response;
            }

            async function executeAnalyticalReport(map) {
                const execute = await RuntimeManagerRepository.executeFlow(
                    "analyticalReport",
                    map
                );
                return execute.response;
            }

            async function executeQuery(_execute, params) {
                const spark = new Object({
                    execute: _execute,
                    ...(params
                        ? {
                              params: params,
                          }
                        : {
                              params: new Object(),
                          }),
                });

                const execute = await RuntimeManagerRepository.executeFlow(
                    "executeQuery",
                    spark
                );

                return execute.response;
            }

            return {
                executeFaaS,
                executeContractRule,
                executeContractTimeline,
                executeAnalyticalReport,
                executeQuery,
            };
        },
    ]);
})();
