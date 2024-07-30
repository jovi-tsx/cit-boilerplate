# Boilerplate Projetos Low Code CIT

Este repositório contém um boilerplate para uso da equipe da Central IT. O objetivo é fornecer uma base padrão para iniciar novos projetos, com configurações consistentes e práticas recomendadas.

---

## Tabela de Conteúdo

1. [Responsabilidade Única](#responsabilidade-única)
1. [IIFE](#iife)
1. [Módulos](#módulos)
1. [Controladores](#controladores) - Pendente
1. [Diretivas](#diretivas) - Pendente
1. [Resolvendo Promises](#resolvendo-promises) - Pendente
1. [Nomes](#nomes)
1. [Rotas](#rotas)

---

## Como Iniciar

1. Clone o repositório: `git clone https://github.com/jovi-tsx/cit-boilerplate.git`
2. Instale as dependências: `npm install`
3. Inicie o desenvolvimento: `npm run dev`

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

## Responsabilidade Única

### Regra de 1

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

### Funções Pequenas

- Defina funções pequenas, com no máximo 75 linhas de código (menos é melhor).

    _Por quê?_: Funções pequenas são mais fáceis de testar, especialmente quando fazem uma coisa e servem a um propósito.

    _Por quê?_: Funções pequenas promovem a reutilização.

    _Por quê?_: Funções pequenas são mais fáceis de ler.

    _Por quê?_: Funções pequenas são mais fáceis de manter.

    _Por quê?_: Funções pequenas ajudam a evitar bugs ocultos que surgem com funções grandes que compartilham variáveis com escopo externo, criam closures indesejadas ou acoplamento indesejado com dependências.

**[Voltar ao topo](#tabela-de-conteúdo)**

## IIFE

### Escopos em JavaScript

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

## Módulos

### Evitar Colisões de Nomes

- Use convenções de nomenclatura únicas com separadores para submódulos.

    _Por quê?_: Nomes únicos ajudam a evitar colisões de nomes de módulos. Os separadores ajudam a definir módulos e sua hierarquia de submódulos. Por exemplo, `app` pode ser seu módulo raiz enquanto `app.dashboard` e `app.users` podem ser módulos usados como dependências de `app`.

### Definições (também conhecidos como Setters)

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

## Nomes

### Diretrizes de Nomenclatura

- Use nomes consistentes para todos os componentes seguindo um padrão que descreve a funcionalidade do componente e (opcionalmente) seu tipo. Meu padrão recomendado é `funcionalidade.tipo.js`. Existem 2 nomes para a maioria dos recursos:
  - o nome do arquivo (`avengers.controller.js`)
  - o nome do componente registrado com Angular (`AvengersController`)

      _Por quê?_: Convenções de nomenclatura ajudam a fornecer uma maneira consistente de encontrar conteúdo rapidamente. A consistência dentro do projeto é vital. A consistência com a equipe é importante. A consistência em toda a empresa proporciona uma eficiência tremenda.

      _Por quê?_: As convenções de nomenclatura devem simplesmente ajudá-lo a encontrar seu código mais rápido e torná-lo mais fácil de entender.

### Nomes de Arquivos de Funcionalidades

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

### Nomes de Arquivos de Teste

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

### Nomes de Controladores

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

### Sufixo de Nome de Controlador

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

### Nomes de Fábricas e Serviços

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

### Nomes de Componentes de Diretiva

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

### Nomes de Módulos

- Quando há vários módulos, o arquivo do módulo principal é nomeado `app.module.js`, enquanto outros módulos dependentes são nomeados de acordo com o que representam. Por exemplo, um módulo de administração é nomeado `admin.module.js`. Os respectivos nomes de módulos registrados seriam `app` e `admin`.

    _Por quê?_: Fornece consistência para aplicativos de múltiplos módulos e para expansão para grandes aplicações.

    _Por quê?_: Fornece uma maneira fácil de usar automação de tarefas para carregar todas as definições de módulos primeiro, depois todos os outros arquivos Angular (para empacotamento).

### Configuração

- Separe a configuração de um módulo em seu próprio arquivo, nomeado de acordo com o módulo. Um arquivo de configuração para o módulo principal `app` é nomeado `app.config.js` (ou simplesmente `config.js`). Uma configuração para um módulo nomeado `admin.module.js` é nomeada `admin.config.js`.

    _Por quê?_: Separa configuração de definição de módulo, componentes e código ativo.

    _Por quê?_: Fornece um local identificável para definir configuração de um módulo.

### Rotas

- Separe a configuração de rotas em seu próprio arquivo. Exemplos podem ser `app.route.js` para o módulo principal e `admin.route.js` para o módulo `admin`. Mesmo em aplicativos menores, prefiro essa separação do restante da configuração.
