const { shadowRoot } = document.body;

angular.module("app", ["ui.router"]).run(() => {
    console.log("Módulo 'app' inicializado");
});

angular.element(document).ready(function () {
    angular.bootstrap(shadowRoot.querySelector("[ng-app]"), ["app"]);
});
