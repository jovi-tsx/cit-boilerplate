# Boilerplate Projetos Low Code CIT

Este repositório contém um boilerplate para uso da equipe da Central IT. O objetivo é fornecer uma base padrão para iniciar novos projetos, com configurações consistentes e práticas recomendadas.

---

## Tabela de Conteúdo

1. [Responsabilidade Única](#responsabilidade-única)
1. [IIFE](#iife)
1. [Módulos](#módulos)
1. [Controladores](#controladores)
1. [Diretivas](#diretivas)
1. [Componentes](#componentes)
1. [Resolvendo Promises](#resolvendo-promises)
1. [Nomeação](#nomeação)
1. [Rotas](#rotas)

---

## Como Iniciar

1. Clone o repositório: `git clone https://github.com/jovi-tsx/cit-boilerplate.git`
2. Instale as dependências: `npm install`, `yarn install`, `pn install`
3. Inicie o desenvolvimento: `npm run dev`, `yarn dev`, `pn dev`

---

## Low Code Deploy

### Função de serviço da Central IT

As requisições utilizando o _RuntimeManagerRepository_ e o _DataAccessObject_ deverão ser chamados através do `$scope`, ficando da seguinte maneira:

```js
let response = await RuntimeManagerRepository.executeFaaS(
    "CCAB_SERVICE",
    params
);
let response = await $scope.executeFaaS("CCAB_SERVICE", params);
```

---

## Guia de Boas Práticas

_O guia abaixo contém trechos retirados da documentação do John Papa (Google Developer Expert) e adaptados para o cenário da Central IT, caso queira ver o conteúdo na íntegra, acesse o [arquivo README](https://github.com/johnpapa/angular-styleguide/blob/master/a1/README.md) dele sobre boas práticas de AngularJS._

### Responsabilidade Única

#### Regra de 1

- Defina 1 componente por arquivo, recomendado que seja com menos de 400 linhas de código.

    _Por quê?_: Um componente por arquivo promove testes unitários e mocks mais fáceis.

    _Por quê?_: Um componente por arquivo facilita muito a leitura, manutenção e evita colisões com equipes no controle de versão.

    _Por quê?_: Um componente por arquivo evita bugs ocultos que frequentemente surgem ao combinar componentes em um arquivo onde eles podem compartilhar variáveis, criar closures indesejadas ou acoplamento indesejado com dependências.

    O exemplo a seguir define o módulo `app` e suas dependências, define um controlador e uma fábrica, tudo no mesmo arquivo.

    ```javascript
    /* evite */
    angular
        .module("app", ["ngRoute"])
        .controller("SomeController", SomeController)
        .factory("someFactory", someFactory);

    function SomeController() {}

    function someFactory() {}
    ```

    Os mesmos componentes agora estão separados em seus próprios arquivos.

    ```javascript
    /* recomendado */

    // app.module.js
    angular.module("app", ["ngRoute"]);
    ```

    ```javascript
    /* recomendado */

    // some.controller.js
    angular.module("app").controller("SomeController", SomeController);

    function SomeController() {}
    ```

    ```javascript
    /* recomendado */

    // some.factory.js
    angular.module("app").factory("someFactory", someFactory);

    function someFactory() {}
    ```

**[Voltar ao topo](#tabela-de-conteúdo)**

#### Funções Pequenas

- Defina funções pequenas, com no máximo 75 linhas de código (menos é melhor).

    _Por quê?_: Funções pequenas são mais fáceis de testar, especialmente quando fazem uma coisa e servem a um propósito.

    _Por quê?_: Funções pequenas promovem a reutilização.

    _Por quê?_: Funções pequenas são mais fáceis de ler.

    _Por quê?_: Funções pequenas são mais fáceis de manter.

    _Por quê?_: Funções pequenas ajudam a evitar bugs ocultos que surgem com funções grandes que compartilham variáveis com escopo externo, criam closures indesejadas ou acoplamento indesejado com dependências.

**[Voltar ao topo](#tabela-de-conteúdo)**

### IIFE

#### Escopos em JavaScript

- Envolva componentes Angular em uma Expressão de Função Auto-invocada (IIFE).

    _Por quê?_: Uma IIFE remove variáveis do escopo global. Isso ajuda a evitar que variáveis e declarações de função permaneçam mais tempo do que o esperado no escopo global, o que também ajuda a evitar colisões de variáveis.

    _Por quê?_: Quando seu código é minificado e empacotado em um único arquivo para implantação em um servidor de produção, você pode ter colisões de variáveis e muitas variáveis globais. Uma IIFE protege contra ambos, fornecendo escopo de variáveis para cada arquivo.

    ```javascript
    /* evite */
    // logger.js
    angular.module("app").factory("logger", logger);

    // a função logger é adicionada como uma variável global
    function logger() {}

    // storage.js
    angular.module("app").factory("storage", storage);

    // a função storage é adicionada como uma variável global
    function storage() {}
    ```

    ```javascript
    /**
     * recomendado
     *
     * nenhuma variável global é deixada para trás
     */

    // logger.js
    (function () {
        "use strict";

        angular.module("app").factory("logger", logger);

        function logger() {}
    })();

    // storage.js
    (function () {
        "use strict";

        angular.module("app").factory("storage", storage);

        function storage() {}
    })();
    ```

- Nota: Para brevidade, apenas, os demais exemplos neste guia podem omitir a sintaxe IIFE.

- Nota: IIFEs impedem que o código de teste alcance membros privados como expressões regulares ou funções auxiliares, que muitas vezes são boas para testes unitários diretamente por conta própria. No entanto, você pode testá-los através de membros acessíveis ou expondo-os através de seu próprio componente. Por exemplo, colocando funções auxiliares, expressões regulares ou constantes em sua própria fábrica ou constante.

**[Voltar ao topo](#tabela-de-conteúdo)**

### Módulos

#### Evitar Colisões de Nomes

- Use convenções de nomenclatura únicas com separadores para submódulos.

    _Por quê?_: Nomes únicos ajudam a evitar colisões de nomes de módulos. Os separadores ajudam a definir módulos e sua hierarquia de submódulos. Por exemplo, `app` pode ser seu módulo raiz enquanto `app.dashboard` e `app.users` podem ser módulos usados como dependências de `app`.

#### Definições (também conhecidos como Setters)

- Declare módulos sem uma variável usando a sintaxe setter.

    _Por quê?_: Com 1 componente por arquivo, raramente há necessidade de introduzir uma variável para o módulo.

    ```javascript
    /* evite */
    var app = angular.module("app", [
        "ngAnimate",
        "ngRoute",
        "app.shared",
        "app.dashboard",
    ]);
    ```

    Em vez disso, use a simples sintaxe setter.

    ```javascript
    /* recomendado */
    angular.module("app", [
        "ngAnimate",
        "ngRoute",
        "app.shared",
        "app.dashboard",
    ]);
    ```

### Controladores

#### Sintaxe de Visualização com controllerAs

- Use a sintaxe controllerAs em vez da sintaxe clássica de controlador com `$scope`.

    _Por quê?_: Controladores são construídos, instanciados, e fornecem uma nova instância, e a sintaxe controllerAs é mais próxima de um construtor JavaScript do que a sintaxe clássica $scope.

    _Por quê?_: Promove o uso de ligação a um objeto "pontilhado" na visualização (por exemplo, cliente.nome em vez de nome), o que é mais contextual, mais fácil de ler e evita problemas de referência que podem ocorrer sem "pontuação".

    _Por quê?_: Ajuda a evitar o uso de chamadas $parent em visualizações com controladores aninhados.

```html
<!-- evitar -->
<div ng-controller="CustomerController">
    {{ nome }}
</div>
```

```html
<!-- recomendado -->
<div ng-controller="CustomerController as cliente">
    {{ cliente.nome }}
</div>
```

#### Sintaxe de Controlador com controllerAs

- Use a sintaxe `controllerAs` em vez da sintaxe clássica de controlador com `$scope`.
- A sintaxe `controllerAs` usa this dentro dos controladores, que é vinculado ao `$scope`.

_Por quê?_: controllerAs é uma sintaxe açucarada sobre `$scope`. Você ainda pode vincular à visualização e acessar métodos de `$scope`.

_Por quê?_: Ajuda a evitar a tentação de usar métodos de `$scope` dentro de um controlador quando pode ser melhor evitá-los ou mover o método para uma fábrica e referenciá-los a partir do controlador. Considere usar `$scope` em um controlador apenas quando necessário. Por exemplo, ao publicar e assinar eventos usando `$emit`, `$broadcast` ou `$on`.

```javascript
/* evitar */
function CustomerController($scope) {
    $scope.nome = {};
    $scope.enviarMensagem = function() { };
}
```

```javascript
/* recomendado - mas veja a próxima seção */
function CustomerController() {
    this.nome = {};
    this.enviarMensagem = function() { };
}
```

#### controllerAs com vm

- Use uma variável de captura para `this` ao usar a sintaxe `controllerAs`. Escolha um nome de variável consistente, como `vm`, que significa ViewModel.

_Por quê?_: A palavra-chave `this` é contextual e, quando usada dentro de uma função dentro de um controlador, pode mudar seu contexto. Capturar o contexto de `this` evita encontrar esse problema.

```javascript
/* evitar */
function CustomerController() {
    this.nome = {};
    this.enviarMensagem = function() { };
}
```

```javascript
/* recomendado */
function CustomerController() {
    var vm = this;
    vm.nome = {};
    vm.enviarMensagem = function() { };
}
```

Nota: Ao criar watches em um controlador usando `controller as`, você pode assistir o membro `vm.*` usando a seguinte sintaxe. (Crie watches com cautela, pois eles adicionam mais carga ao ciclo de digestão.)

```html
<input ng-model="vm.titulo"/>
```

```javascript
function SomeController($scope, $log) {
    var vm = this;
    vm.titulo = 'Algum Título';

    $scope.$watch('vm.titulo', function(atual, original) {
        $log.info('vm.titulo era %s', original);
        $log.info('vm.titulo agora é %s', atual);
    });
}
```

Nota: Ao trabalhar com bases de código maiores, usar um nome mais descritivo pode ajudar a reduzir a sobrecarga cognitiva e a capacidade de busca. Evite nomes excessivamente verbosos que sejam complicados de digitar.

```html
<!-- evitar -->
<input ng-model="customerProductItemVm.titulo">
```

```html
<!-- recomendado -->
<input ng-model="productVm.titulo">
```

#### Membros Vinculáveis no Topo

- Coloque os membros vinculáveis no topo do controlador, em ordem alfabética, e não espalhados pelo código do controlador.

    _Por quê?_: Colocar os membros vinculáveis no topo facilita a leitura e ajuda você a identificar instantaneamente quais membros do controlador podem ser vinculados e usados na visualização.

    _Por quê?_: Definir funções anônimas em linha pode ser fácil, mas quando essas funções têm mais de uma linha de código, elas podem reduzir a legibilidade. Definir as funções abaixo dos membros vinculáveis (as funções serão içadas) move os detalhes da implementação para baixo, mantém os membros vinculáveis no topo e facilita a leitura.

```javascript
/* evitar */
function SessionsController() {
    var vm = this;

    vm.irParaSessao = function() {
      /* ... */
    };
    vm.atualizar = function() {
      /* ... */
    };
    vm.buscar = function() {
      /* ... */
    };
    vm.sessoes = [];
    vm.titulo = 'Sessões';
}
```

```javascript
/* recomendado */
function SessionsController() {
    var vm = this;

    vm.irParaSessao = irParaSessao;
    vm.atualizar = atualizar;
    vm.buscar = buscar;
    vm.sessoes = [];
    vm.titulo = 'Sessões';

    ////////////

    function irParaSessao() {
      /* */
    }

    function atualizar() {
      /* */
    }

    function buscar() {
      /* */
    }
}
```

![Controller Using "Above the Fold"](https://raw.githubusercontent.com/johnpapa/angular-styleguide/master/a1/assets/above-the-fold-1.png)

Nota: Se a função for de uma linha, considere mantê-la no topo, desde que a legibilidade não seja afetada.

```javascript
/* evitar */
function SessionsController(data) {
    var vm = this;

    vm.irParaSessao = irParaSessao;
    vm.atualizar = function() {
        /**
         * linhas
         * de
         * código
         * afetam
         * a legibilidade
         */
    };
    vm.buscar = buscar;
    vm.sessoes = [];
    vm.titulo = 'Sessões';
}
```

```javascript
/* recomendado */
function SessionsController(sessionDataService) {
    var vm = this;

    vm.irParaSessao = irParaSessao;
    vm.atualizar = sessionDataService.atualizar; // 1 linha é OK
    vm.buscar = buscar;
    vm.sessoes = [];
    vm.titulo = 'Sessões';
}
```

#### Declarações de Funções para Ocultar Detalhes de Implementação

- Use declarações de função para ocultar detalhes de implementação. Mantenha seus membros vinculáveis no topo. Quando precisar vincular uma função em um controlador, aponte-a para uma declaração de função que aparece mais tarde no arquivo. Isso está diretamente relacionado à seção Membros Vinculáveis no Topo. Para mais detalhes, [veja este post](http://www.johnpapa.net/angular-function-declarations-function-expressions-and-readable-code/).

    _Por quê?_: Colocar membros vinculáveis no topo facilita a leitura e ajuda você a identificar instantaneamente quais membros do controlador podem ser vinculados e usados na visualização. (Mesmo que acima.)

    _Por quê?_: Colocar os detalhes de implementação de uma função mais tarde no arquivo move essa complexidade para fora de vista, para que você possa ver as partes importantes no topo.

    _Por quê?_: Declarações de função são içadas, então não há preocupações sobre usar uma função antes de ser definida (como haveria com expressões de função).

    _Por quê?_: Você nunca precisa se preocupar com declarações de função que movem var a antes de var b quebrar seu código porque a depende de b.

    _Por quê?_: A ordem é crítica com expressões de função.

```javascript
/**
 * evitar
 * Usando expressões de função.
 */
function AvengersController(avengersService, logger) {
    var vm = this;
    vm.vingadores = [];
    vm.titulo = 'Vingadores';

    var ativar = function() {
        return obterVingadores().then(function() {
            logger.info('Vista de Vingadores Ativada');
        });
    }

    var obterVingadores = function() {
        return avengersService.obterVingadores().then(function(data) {
            vm.vingadores = data;
           
```

#### Deferir a Lógica do Controller para Serviços

- Deferir a lógica em um controller, delegando-a para serviços e factories.

    _Por que?_: A lógica pode ser reutilizada por múltiplos controllers quando colocada dentro de um serviço e exposta via uma função.

    _Por que?_: A lógica em um serviço pode ser mais facilmente isolada em um teste unitário, enquanto a lógica chamadora no controller pode ser facilmente simulada.

    _Por que?_: Remove dependências e esconde detalhes de implementação do controller.

    _Por que?_: Mantém o controller enxuto e focado.

```javascript
/* evite */
function OrderController($http, $q, config, userInfo) {
    var vm = this;
    vm.checkCredit = checkCredit;
    vm.isCreditOk;
    vm.total = 0;

    function checkCredit() {
        var settings = {};
        // Obtenha a URL base do serviço de crédito a partir do config
        // Defina os cabeçalhos necessários para o serviço de crédito
        // Prepare a string de consulta da URL ou objeto de dados com a solicitação
        // Adicione informações de identificação do usuário para que o serviço obtenha o limite de crédito correto para este usuário.
        // Use JSONP para este navegador se ele não suportar CORS
        return $http.get(settings)
            .then(function(data) {
             // Desempacote os dados JSON no objeto de resposta
               // para encontrar maxRemainingAmount
               vm.isCreditOk = vm.total <= maxRemainingAmount
            })
            .catch(function(error) {
               // Interprete o erro
               // Lide com o timeout? Tente novamente? Tente um serviço alternativo?
               // Rejeite novamente com o erro apropriado para o usuário ver
            });
    };
}
```

#### Mantenha os Controllers Focados

- Defina um controller para uma view e tente não reutilizar o controller para outras views. Em vez disso, mova a lógica reutilizável para factories e mantenha o controller simples e focado na sua view.

    _Por que?_: Reutilizar controllers com várias views é frágil, e uma boa cobertura de teste end-to-end (e2e) é necessária para garantir a estabilidade em grandes aplicações.

#### Atribuindo Controllers

- Quando um controller deve ser emparelhado com uma view e qualquer componente pode ser reutilizado por outros controllers ou views, defina os controllers junto com suas rotas.

    Nota: Se uma View for carregada por outro meio que não uma rota, use a sintaxe ng-controller="Avengers as vm".

    _Por que?_: Emparelhar o controller na rota permite que diferentes rotas invoquem diferentes pares de controllers e views. Quando os controllers são atribuídos na view usando ng-controller, aquela view está sempre associada ao mesmo controller.

```javascript
/* evite - ao usar com uma rota e emparelhamento dinâmico é desejado */

// route-config.js
angular
    .module('app')
    .config(config);

function config($routeProvider) {
    $routeProvider
        .when('/avengers', {
        templateUrl: 'avengers.html'
        });
}
```

```html
<!-- avengers.html -->
<div ng-controller="AvengersController as vm">
</div>
```

```javascript
/* recomendado */

// route-config.js
angular
    .module('app')
    .config(config);

function config($routeProvider) {
    $routeProvider
        .when('/avengers', {
            templateUrl: 'avengers.html',
            controller: 'Avengers',
            controllerAs: 'vm'
        });
}
```

```html
<!-- avengers.html -->
<div>
</div>
```

**[Voltar ao topo](#tabela-de-conteúdo)**

### Diretivas

- **Disclaimer:** Antes de criar uma diretiva, leia sobre [Componentes](#componentes) pois na grande maioria dos casos você poderá substituir as diretivas por um componente que é mais simples de declarar e migrar para novas versões de Angular.

#### Limitar 1 Por Arquivo

- Crie uma diretiva por arquivo. Nomeie o arquivo de acordo com a diretiva.

    _Por que?_: É fácil juntar todas as diretivas em um arquivo, mas difícil separar depois para que algumas sejam compartilhadas entre aplicativos, outras entre módulos e algumas apenas para um módulo.

    _Por que?_: Uma diretiva por arquivo é fácil de manter.

    > Nota: "**Melhores Práticas**: As diretivas devem remover quaisquer efeitos ou alterações que tenham feito quando elas são destruídas ou removidas do DOM. Você pode usar element.on('$destroy', ...) ou scope.$on('$destroy', ...) para executar uma função de limpeza quando a diretiva for removida" ... Leia [na documentação do AngularJS](https://docs.angularjs.org/guide/directive).

```javascript
/* evitar */
/* directives.js */

angular
    .module('app.widgets')

    /* diretiva de pedido específica para o módulo de pedidos */
    .directive('orderCalendarRange', orderCalendarRange)

    /* diretiva de vendas que pode ser usada em qualquer lugar no aplicativo de vendas */
    .directive('salesCustomerInfo', salesCustomerInfo)

    /* diretiva de spinner que pode ser usada em qualquer lugar nos aplicativos */
    .directive('sharedSpinner', sharedSpinner);

function orderCalendarRange() {
    /* detalhes de implementação */
}

function salesCustomerInfo() {
    /* detalhes de implementação */
}

function sharedSpinner() {
    /* detalhes de implementação */
}
```

```javascript
/* recomendado */
/* calendar-range.directive.js */

/**
 * @desc diretiva de pedido específica para o módulo de pedidos em uma empresa chamada Acme
 * @example <div acme-order-calendar-range></div>
 */
angular
    .module('sales.order')
    .directive('acmeOrderCalendarRange', orderCalendarRange);

function orderCalendarRange() {
    /* detalhes de implementação */
}
```

```javascript
/* recomendado */
/* calendar-range.directive.js */

/**
 * @desc diretiva de pedido específica para o módulo de pedidos em uma empresa chamada Acme
 * @example <div acme-order-calendar-range></div>
 */
angular
    .module('sales.order')
    .directive('acmeOrderCalendarRange', orderCalendarRange);

function orderCalendarRange() {
    /* detalhes de implementação */
}
```

```javascript
/* recomendado */
/* customer-info.directive.js */

/**
 * @desc diretiva de vendas que pode ser usada em
 * qualquer lugar no aplicativo de vendas em uma empresa chamada Acme
 * @example <div acme-sales-customer-info></div>
 */
angular
    .module('sales.widgets')
    .directive('acmeSalesCustomerInfo', salesCustomerInfo);

function salesCustomerInfo() {
    /* detalhes de implementação */
}
```

```javascript
/* recomendado */
/* spinner.directive.js */

/**
 * @desc diretiva de spinner que pode ser usada em
 * qualquer lugar nos aplicativos em uma empresa chamada Acme
 * @example <div acme-shared-spinner></div>
 */
angular
    .module('shared.widgets')
    .directive('acmeSharedSpinner', sharedSpinner);

function sharedSpinner() {
    /* detalhes de implementação */
}
```

#### Manipular DOM em uma Diretiva

- Ao manipular o DOM diretamente, use uma diretiva. Se outras maneiras podem ser usadas, como usar CSS para definir estilos ou os serviços de animação, templating do Angular, ngShow ou ngHide, então use essas alternativas. Por exemplo, se a diretiva simplesmente oculta e mostra, use ngHide/ngShow.

  _Por que?_: A manipulação do DOM pode ser difícil de testar, depurar, e geralmente há maneiras melhores (por exemplo, CSS, animações, templates)

#### Fornecer um Prefixo de Diretiva Único

- Forneça um prefixo de diretiva curto, único e descritivo, como acmeSalesCustomerInfo, que seria declarado em HTML como acme-sales-customer-info.

  _Por que?_: O prefixo curto e único identifica o contexto e a origem da diretiva. Por exemplo, um prefixo de cc- pode indicar que a diretiva faz parte de um aplicativo CodeCamper, enquanto acme- pode indicar uma diretiva para a empresa Acme.

  Nota: Evite ng-, pois estes são reservados para diretivas do Angular. Pesquise diretivas amplamente usadas para evitar conflitos de nome, como ion- para o Ionic Framework.

#### Restringir a Elementos e Atributos

- Ao criar uma diretiva que faz sentido como um elemento independente, permita restrição E (elemento personalizado) e, opcionalmente, restrição A (atributo personalizado). Geralmente, se poderia ser seu próprio controle, E é apropriado. Diretriz geral é permitir EA, mas tendendo a implementar como um elemento quando for independente e como um atributo quando melhorar seu elemento DOM existente.

  _Por que?_: Faz sentido.

  _Por que?_: Embora possamos permitir que a diretiva seja usada como uma classe, se a diretiva estiver realmente atuando como um elemento, faz mais sentido como um elemento ou pelo menos como um atributo.

  Nota: EA é o padrão para Angular 1.3 +

```html
<!-- evitar -->
<div class="my-calendar-range"></div>
```

```javascript
/* evitar */
angular
    .module('app.widgets')
    .directive('myCalendarRange', myCalendarRange);

function myCalendarRange() {
    var directive = {
        link: link,
        templateUrl: '/template/is/located/here.html',
        restrict: 'C'
    };

    return directive;

    function link(scope, element, attrs) {
      /* */
    }
}
```

```html
<!-- recomendado -->
<my-calendar-range></my-calendar-range>
<div my-calendar-range></div>
```

```javascript
/* recomendado */
angular
    .module('app.widgets')
    .directive('myCalendarRange', myCalendarRange);

function myCalendarRange() {
    var directive = {
        link: link,
        templateUrl: '/template/is/located/here.html',
        restrict: 'EA'
    };
    return directive;

    function link(scope, element, attrs) {
      /* */
    }
}
```

#### Diretivas e ControllerAs

- Use a sintaxe controllerAs com uma diretiva para ser consistente com o uso de controller as com pares de visualização e controlador.

    _Por que?_: Faz sentido e não é difícil.

    Nota: A diretiva abaixo demonstra algumas das maneiras de usar o escopo dentro de link e controladores de diretiva, usando controllerAs. Incluí o template apenas para manter tudo em um só lugar.

    Nota: Observe que o controlador da diretiva está fora do fechamento da diretiva. Esse estilo elimina problemas onde a injeção é criada como código inalcançável após um `return`.

    Nota: Ganchos de ciclo de vida (Lifecycle hooks) foram introduzidos no Angular 1.5. A lógica de inicialização que depende de bindings deve ser colocada no método $onInit() do controlador, que é garantido ser sempre chamado após os bindings serem atribuídos.

```html
<div my-example max="77"></div>
```

```javascript
angular
    .module('app')
    .directive('myExample', myExample);

function myExample() {
    var directive = {
        restrict: 'EA',
        templateUrl: 'app/feature/example.directive.html',
        scope: {
            max: '='
        },
        link: linkFunc,
        controller: ExampleController,
        // nota: Este seria 'ExampleController' (o nome do controlador exportado, como string)
        // se referindo a um controlador definido em seu arquivo separado.
        controllerAs: 'vm',
        bindToController: true // porque o escopo é isolado
    };

    return directive;

    function linkFunc(scope, el, attr, ctrl) {
        console.log('LINK: scope.min = %s *** deve estar indefinido', scope.min);
        console.log('LINK: scope.max = %s *** deve estar indefinido', scope.max);
        console.log('LINK: scope.vm.min = %s', scope.vm.min);
        console.log('LINK: scope.vm.max = %s', scope.vm.max);
    }
}

ExampleController.$inject = ['$scope'];

function ExampleController($scope) {
    // Injetando $scope apenas para comparação
    var vm = this;
    vm.min = 3;
    vm.$onInit = onInit;
    
    //////////
    
    console.log('CTRL: $scope.vm.min = %s', $scope.vm.min);
    console.log('CTRL: $scope.vm.max = %s', $scope.vm.max); // indefinido no Angular 1.5+
    console.log('CTRL: vm.min = %s', vm.min);
    console.log('CTRL: vm.max = %s', vm.max); // indefinido no Angular 1.5+
    
    // Angular 1.5+ não faz binding de atributos até chamar $onInit();
    function onInit() {
        console.log('CTRL-onInit: $scope.vm.min = %s', $scope.vm.min);
        console.log('CTRL-onInit: $scope.vm.max = %s', $scope.vm.max);
        console.log('CTRL-onInit: vm.min = %s', vm.min);
        console.log('CTRL-onInit: vm.max = %s', vm.max);
    }
}
```

```html
<!-- example.directive.html -->
<div>olá mundo</div>
<div>máx={{vm.max}}<input ng-model="vm.max"/></div>
<div>mín={{vm.min}}<input ng-model="vm.min"/></div>
```

Nota: Você também pode nomear o controlador ao injetá-lo na função de link e acessar os atributos da diretiva como propriedades do controlador.

```javascript
// Alternativa ao exemplo acima
function linkFunc(scope, el, attr, vm) {
    console.log('LINK: scope.min = %s *** deve estar indefinido', scope.min);
    console.log('LINK: scope.max = %s *** deve estar indefinido', scope.max);
    console.log('LINK: vm.min = %s', vm.min);
    console.log('LINK: vm.max = %s', vm.max);
}
```

- Use bindToController = true ao usar a sintaxe **controller as** com uma diretiva quando você quiser vincular o escopo externo ao escopo do controlador da diretiva.

    _Por que?_: Facilita a vinculação do escopo externo ao escopo do controlador da diretiva.

    Nota: bindToController foi introduzido no Angular 1.3.0.

```html
<div my-example max="77"></div>
```

```javascript
angular
    .module('app')
    .directive('myExample', myExample);

function myExample() {
    var directive = {
        restrict: 'EA',
        templateUrl: 'app/feature/example.directive.html',
        scope: {
            max: '='
        },
        controller: ExampleController,
        controllerAs: 'vm',
        bindToController: true
    };

    return directive;
}

function ExampleController() {
    var vm = this;
    vm.min = 3;
    vm.$onInit = onInit;
    
    function onInit() = {
        console.log('CTRL: vm.min = %s', vm.min);
        console.log('CTRL: vm.max = %s', vm.max);
    }
}
```

```html
<!-- example.directive.html -->
<div>olá mundo</div>
<div>máx={{vm.max}}<input ng-model="vm.max"/></div>
<div>mín={{vm.min}}<input ng-model="vm.min"/></div>
```

**[Voltar ao topo](#tabela-de-conteúdo)**

### Componentes

Um componente é um tipo especial de diretiva que utiliza uma configuração simplificada e mais adequada para uma estrutura de aplicação baseada em componentização.

Vantagens de componentes:

- Configuração mais simples do que diretivas.
- Promove padrões sensatos e melhores práticas
- Otimizado para arquiteturas component-based
- Escrever diretivas em componentes tornará mais fácil de migrar para o Angular 2 ou posterior.

Quando não usar componentes:

- Para diretivas que dependem de manipulação do DOM, adicionando listeners de eventos, etc., porque as funções `compile` e `link` não estão disponíveis.
- Quando você precisa de opções avançadas de definição de diretivas, como prioridade, terminal, multi-elemento.
- Quando você quer uma diretiva que seja acionada por um atributo ou classe CSS, em vez de um elemento.

**[Voltar ao topo](#tabela-de-conteúdo)**

### Resolvendo Promises

#### Promessas de Ativação de Controllers

- Resolva a lógica de inicialização para um controller em uma função activate.

    _Por que?_: Colocar a lógica de inicialização em um lugar consistente no controller facilita a localização, torna mais consistente para testar e ajuda a evitar espalhar a lógica de ativação pelo controller.

    _Por que?_: O activate do controller facilita a reutilização da lógica para uma atualização do controller/View, mantém a lógica junta, leva o usuário mais rapidamente para a View, facilita animações no ng-view ou ui-view, e dá uma sensação de maior agilidade para o usuário.

    Nota: Se você precisar cancelar condicionalmente a rota antes de começar a usar o controller, use uma resolução de rota.

```javascript
/* evite */
function AvengersController(dataservice) {
    var vm = this;
    vm.avengers = [];
    vm.title = 'Avengers';

    dataservice.getAvengers().then(function(data) {
        vm.avengers = data;
        return vm.avengers;
    });
}
```

```javascript
/* recomendado */
function AvengersController(dataservice) {
    var vm = this;
    vm.avengers = [];
    vm.title = 'Avengers';

    activate();

    ////////////

    function activate() {
        return dataservice.getAvengers().then(function(data) {
            vm.avengers = data;
            return vm.avengers;
        });
    }
}
```

#### Promessas de Resolução de Rotas

- Quando um controller depende de uma promessa a ser resolvida antes que o controller seja ativado, resolva essas dependências no $routeProvider antes da lógica do controller ser executada. Se precisar cancelar condicionalmente uma rota antes do controller ser ativado, use um resolvedor de rota.

- Use uma resolução de rota quando você quiser decidir cancelar a rota antes de realmente fazer a transição para a View.

    _Por que?_: Um controller pode exigir dados antes de ser carregado. Esses dados podem vir de uma promessa via uma fábrica personalizada ou $http. Usar uma resolução de rota permite que a promessa seja resolvida antes da lógica do controller ser executada, para que possa agir com base nesses dados da promessa.

    _Por que?_: O código é executado após a rota e na função de ativação do controller. A View começa a carregar imediatamente. A vinculação de dados é ativada quando a promessa de ativação é resolvida. Uma animação de “ocupado” pode ser mostrada durante a transição da view (via ng-view ou ui-view).

    Nota: O código é executado antes da rota via uma promessa. Rejeitar a promessa cancela a rota. A resolução faz a nova view esperar pela resolução da rota. Uma animação de “ocupado” pode ser mostrada antes da resolução e durante a transição da view. Se você quiser chegar à View mais rapidamente e não precisar de um ponto de verificação para decidir se pode chegar à View, considere a técnica de ativação do controller.

```javascript
/* evite */
angular
    .module('app')
    .controller('AvengersController', AvengersController);

function AvengersController(movieService) {
    var vm = this;
    // não resolvido
    vm.movies;
    // resolvido assincronamente
    movieService.getMovies().then(function(response) {
        vm.movies = response.movies;
    });
}
```

```javascript
/* melhor */

// route-config.js
angular
    .module('app')
    .config(config);

function config($routeProvider) {
    $routeProvider
        .when('/avengers', {
            templateUrl: 'avengers.html',
            controller: 'AvengersController',
            controllerAs: 'vm',
            resolve: {
                moviesPrepService: function(movieService) {
                    return movieService.getMovies();
                }
            }
        });
}

// avengers.js
angular
    .module('app')
    .controller('AvengersController', AvengersController);

AvengersController.$inject = ['moviesPrepService'];
function AvengersController(moviesPrepService) {
    var vm = this;
    vm.movies = moviesPrepService.movies;
}
```

Nota: O exemplo de código abaixo mostra a resolução de rota apontando para uma função nomeada, o que é mais fácil de depurar e mais fácil de lidar com a injeção de dependência.

```javascript
/* ainda melhor */

// route-config.js
angular
    .module('app')
    .config(config);

function config($routeProvider) {
    $routeProvider
        .when('/avengers', {
            templateUrl: 'avengers.html',
            controller: 'AvengersController',
            controllerAs: 'vm',
            resolve: {
                moviesPrepService: moviesPrepService
            }
        });
}

function moviesPrepService(movieService) {
    return movieService.getMovies();
}

// avengers.js
angular
    .module('app')
    .controller('AvengersController', AvengersController);

AvengersController.$inject = ['moviesPrepService'];
function AvengersController(moviesPrepService) {
      var vm = this;
      vm.movies = moviesPrepService.movies;
}
```

#### Lidando com Exceções em Promessas

- O bloco catch de uma promessa deve retornar uma promessa rejeitada para manter a exceção na cadeia de promessas.

- Sempre lide com exceções em serviços/factories.

    _Por que?_: Se o bloco catch não retornar uma promessa rejeitada, o chamador da promessa não saberá que ocorreu uma exceção. O then do chamador será executado. Assim, o usuário pode nunca saber o que aconteceu.

    _Por que?_: Para evitar engolir erros e desinformar o usuário.

    Nota: Considere colocar qualquer tratamento de exceção em uma função em um módulo e serviço compartilhado.

```javascript
/* evite */

function getCustomer(id) {
    return $http.get('/api/customer/' + id)
        .then(getCustomerComplete)
        .catch(getCustomerFailed);

    function getCustomerComplete(data, status, headers, config) {
        return data.data;
    }

    function getCustomerFailed(e) {
        var newMessage = 'XHR Failed for getCustomer'
        if (e.data && e.data.description) {
          newMessage = newMessage + '\n' + e.data.description;
        }
        e.data.description = newMessage;
        logger.error(newMessage);
        // ***
        // Perceba que não há retorno da promessa rejeitada
        // ***
    }
}
```

```javascript
/* recomendado */
function getCustomer(id) {
    return $http.get('/api/customer/' + id)
        .then(getCustomerComplete)
        .catch(getCustomerFailed);

    function getCustomerComplete(data, status, headers, config) {
        return data.data;
    }

    function getCustomerFailed(e) {
        var newMessage = 'XHR Failed for getCustomer'
        if (e.data && e.data.description) {
          newMessage = newMessage + '\n' + e.data.description;
        }
        e.data.description = newMessage;
        logger.error(newMessage);
        return $q.reject(e);
    }
}
```

**[Voltar ao topo](#tabela-de-conteúdo)**

### Nomeação

#### Diretrizes de Nomenclatura

- Use nomes consistentes para todos os componentes seguindo um padrão que descreve a funcionalidade do componente e (opcionalmente) seu tipo. Meu padrão recomendado é `funcionalidade.tipo.js`. Existem 2 nomes para a maioria dos recursos:
  - o nome do arquivo (`avengers.controller.js`)
  - o nome do componente registrado com Angular (`AvengersController`)

      _Por quê?_: Convenções de nomenclatura ajudam a fornecer uma maneira consistente de encontrar conteúdo rapidamente. A consistência dentro do projeto é vital. A consistência com a equipe é importante. A consistência em toda a empresa proporciona uma eficiência tremenda.

      _Por quê?_: As convenções de nomenclatura devem simplesmente ajudá-lo a encontrar seu código mais rápido e torná-lo mais fácil de entender.

#### Nomes de Arquivos de Funcionalidades

- Use nomes consistentes para todos os componentes seguindo um padrão que descreve a funcionalidade do componente e (opcionalmente) seu tipo. Meu padrão recomendado é `funcionalidade.tipo.js`.

    _Por quê?_: Fornece uma maneira consistente de identificar rapidamente os componentes.

    _Por quê?_: Fornece correspondência de padrão para qualquer tarefa automatizada.

    ```javascript
    /**
     * opções comuns
     */

    // Controladores
    avengers.js;
    avengers.controller.js;
    avengersController.js;

    // Serviços/Fábricas
    logger.js;
    logger.service.js;
    loggerService.js;
    ```

    ```javascript
    /**
     * recomendado
     */

    // controladores
    avengers.controller.js;
    avengers.controller.spec.js;

    // serviços/fábricas
    logger.service.js;
    logger.service.spec.js;

    // constantes
    constants.js;

    // definição de módulo
    avengers.module.js;

    // rotas
    avengers.routes.js;
    avengers.routes.spec.js;

    // configuração
    avengers.config.js;

    // diretivas
    avenger - profile.directive.js;
    avenger - profile.directive.spec.js;
    ```

    Nota: Outra convenção comum é nomear arquivos de controladores sem a palavra `controller` no nome do arquivo, como `avengers.js` em vez de `avengers.controller.js`. Todas as outras convenções ainda se aplicam usando um sufixo do tipo. Os controladores são o tipo de componente mais comum, então isso apenas economiza digitação e ainda é facilmente identificável. Eu recomendo que você escolha uma convenção e seja consistente para sua equipe. Minha preferência é `avengers.controller.js` identificando o `AvengersController`.

    ```javascript
    /**
     * recomendado
     */
    // Controladores
    avengers.js;
    avengers.spec.js;
    ```

#### Nomes de Arquivos de Teste

- Nomeie especificações de teste de maneira semelhante ao componente que elas testam com um sufixo de `spec`.

    _Por quê?_: Fornece uma maneira consistente de identificar rapidamente os componentes.

    _Por quê?_: Fornece correspondência de padrão para [karma](http://karma-runner.github.io/) ou outros runners de teste.

    ```javascript
    /**
     * recomendado
     */
    avengers.controller.spec.js;
    logger.service.spec.js;
    avengers.routes.spec.js;
    avenger - profile.directive.spec.js;
    ```

#### Nomes de Controladores

- Use nomes consistentes para todos os controladores nomeados de acordo com a funcionalidade. Use UpperCamelCase para controladores, pois são construtores.

    _Por quê?_: Fornece uma maneira consistente de identificar e referenciar controladores rapidamente.

    _Por quê?_: UpperCamelCase é convencional para identificar objetos que podem ser instanciados usando um construtor.

    ```javascript
    /**
     * recomendado
     */

    // avengers.controller.js
    angular.module.controller("HeroAvengersController", HeroAvengersController);

    function HeroAvengersController() {}
    ```

#### Sufixo de Nome de Controlador

- Adicione o sufixo `Controller` ao nome do controlador.

    _Por quê?_: O sufixo `Controller` é mais comumente usado e é mais explicitamente descritivo.

    ```javascript
    /**
     * recomendado
     */

    // avengers.controller.js
    angular.module.controller("AvengersController", AvengersController);

    function AvengersController() {}
    ```

#### Nomes de Fábricas e Serviços

- Use nomes consistentes para todas as fábricas e serviços nomeados de acordo com a funcionalidade. Use camelCase para serviços e fábricas. Evite prefixar fábricas e serviços com `$`. Apenas sufixe serviços e fábricas com `Service` quando não for claro o que são (ou seja, quando são substantivos).

    _Por quê?_: Fornece uma maneira consistente de identificar e referenciar fábricas rapidamente.

    _Por quê?_: Evita colisões de nomes com fábricas e serviços embutidos que usam o prefixo `$`.

    _Por quê?_: Nomes de serviços claros como `logger` não requerem um sufixo.

    _Por quê?_: Nomes de serviços como `avengers` são substantivos e requerem um sufixo, devendo ser nomeados `avengersService`.

    ```javascript
    /**
     * recomendado
     */

    // logger.service.js
    angular.module.factory("logger", logger);

    function logger() {}
    ```

    ```javascript
    /**
     * recomendado
     */

    // credit.service.js
    angular.module.factory("creditService", creditService);

    function creditService() {}

    // customer.service.js
    angular.module.service("customerService", customerService);

    function customerService() {}
    ```

#### Nomes de Componentes de Diretiva

- Use nomes consistentes para todas as diretivas usando camelCase. Use um prefixo curto para descrever a área à qual as diretivas pertencem (alguns exemplos são o prefixo da empresa ou o prefixo do projeto).

    _Por quê?_: Fornece uma maneira consistente de identificar e referenciar componentes.

    ```javascript
    /**
     * recomendado
     */

    // avenger-profile.directive.js
    angular.module.directive("xxAvengerProfile", xxAvengerProfile);

    // uso é <xx-avenger-profile> </xx-avenger-profile>

    function xxAvengerProfile() {}
    ```

#### Nomes de Módulos

- Quando há vários módulos, o arquivo do módulo principal é nomeado `app.module.js`, enquanto outros módulos dependentes são nomeados de acordo com o que representam. Por exemplo, um módulo de administração é nomeado `admin.module.js`. Os respectivos nomes de módulos registrados seriam `app` e `admin`.

    _Por quê?_: Fornece consistência para aplicativos de múltiplos módulos e para expansão para grandes aplicações.

    _Por quê?_: Fornece uma maneira fácil de usar automação de tarefas para carregar todas as definições de módulos primeiro, depois todos os outros arquivos Angular (para empacotamento).

#### Configuração

- Separe a configuração de um módulo em seu próprio arquivo, nomeado de acordo com o módulo. Um arquivo de configuração para o módulo principal `app` é nomeado `app.config.js` (ou simplesmente `config.js`). Uma configuração para um módulo nomeado `admin.module.js` é nomeada `admin.config.js`.

    _Por quê?_: Separa configuração de definição de módulo, componentes e código ativo.

    _Por quê?_: Fornece um local identificável para definir configuração de um módulo.

#### Rotas

- Separe a configuração de rotas em seu próprio arquivo. Exemplos podem ser `app.route.js` para o módulo principal e `admin.route.js` para o módulo `admin`. Mesmo em aplicativos menores, prefiro essa separação do restante da configuração.
