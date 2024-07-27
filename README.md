# Boilerplate Projetos Low Code CIT

Este repositório contém um boilerplate para uso da equipe da Central IT. O objetivo é fornecer uma base padrão para iniciar novos projetos, com configurações consistentes e práticas recomendadas.

-----------------------------------------------------

## Como Usar

1. Clone o repositório: `git clone https://github.com/jovi-tsx/cit-boilerplate.git`
2. Instale as dependências: `npm install`
3. Inicie o desenvolvimento: `npm run dev`

-----------------------------------------------------

## Nomeação

### Diretrizes de Nomeação

- Use nomes consistentes para todos os componentes, seguindo um padrão que descreve a característica do componente e, opcionalmente, seu tipo. Meu padrão recomendado é feature.type.js. Existem 2 nomes para a maioria dos ativos:
  - o nome do arquivo (avengers.controller.js)
  - o nome do componente registrado no Angular (AvengersController)

  *Por quê?*: Convenções de nomenclatura ajudam a fornecer uma maneira consistente de encontrar conteúdo de relance. Consistência dentro do projeto é vital. Consistência com uma equipe é importante. Consistência em toda a empresa proporciona uma eficiência tremenda.

  *Por quê?*: As convenções de nomenclatura devem simplesmente ajudar você a encontrar seu código mais rapidamente e torná-lo mais fácil de entender.

-----------------------------------------------------

## Low Code Deploy

### Função de serviço da Central IT

As requisições utilizando o *RuntimeManagerRepository* e o *DataAccessObject* deverão ser chamados através do `$scope`, ficando da seguinte maneira:

```js
let response = await RuntimeManagerRepository.executeFaaS("CCAB_SERVICE", params);
let response = await $scope.executeFaaS("CCAB_SERVICE", params);
```
