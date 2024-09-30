const app = angular.module(NGAPP_NAME);

app.factory("RuntimeManagerRepository", [
  "$http",
  "$rootScope",
  function ($http, $rootScope) {
    const { $utils } = $rootScope;

    function executeBusinessRule(name, params) {
      const data = {
        ruleName: name,
        data: params,
      };

      $utils.showLoader();

      return $http
        .post(`http://localhost:${SERVER_PORT}/rule`, JSON.stringify(data))
        .then(function (response) {
          console.log("Resultado executeBusinessRule:", response.data);

          return response.data;
        })
        .catch((e) => {
          console.log("Erro executeBusinessRule:", e);
        })
        .finally(() => {
          $utils.hideLoader();
        });
    }

    function executeFlow(name, params) {
      const data = {
        flowName: name,
        data: params,
      };

      $utils.showLoader();

      return $http
        .post(`http://localhost:${SERVER_PORT}/flow`, JSON.stringify(data))
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

    function executeFaaS(name, params) {
      const data = {
        flowName: name,
        data: params,
      };

      $utils.showLoader();

      return $http
        .post(`http://localhost:${SERVER_PORT}/faas`, JSON.stringify(data))
        .then(function (response) {
          console.log("FAAS", response.data.context);

          return response.data.context;
        })
        .catch((e) => {
          console.log("Erro executeBusinessRule:", e);
        })
        .finally(() => {
          $utils.hideLoader();
        });
    }

    function createOrUpdateList(project, businessObject, list) {
      const data = {
        project: project,
        businessObject: businessObject,
        data: list,
      };

      $utils.showLoader();

      return $http
        .post(
          `http://localhost:${SERVER_PORT}/createOrUpdateList`,
          JSON.stringify(data)
        )
        .then(function (response) {
          console.log("FAAS", response.data.context);

          return response.data.context;
        })
        .catch((e) => {
          console.log("Erro executeBusinessRule:", e);
        })
        .finally(() => {
          $utils.hideLoader();
        });
    }

    return {
      executeBusinessRule,
      executeFlow,
      executeFaaS,
      createOrUpdateList,
    };
  },
]);
