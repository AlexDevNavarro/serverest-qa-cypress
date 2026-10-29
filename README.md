# ServeRest - Automação de Testes com Cypress

[![CI](https://github.com/AlexDevNavarro/cypress-serverest-qa/actions/workflows/ci.yml/badge.svg)](https://github.com/AlexDevNavarro/cypress-serverest-qa/actions/workflows/ci.yml)
![Cypress](https://img.shields.io/badge/Cypress-16-69D3A7?logo=cypress&logoColor=white)
![Node](https://img.shields.io/badge/Node-%E2%89%A522-339933?logo=node.js&logoColor=white)

Testes automatizados E2E do **frontend** e testes da **API** da aplicação [ServeRest](https://serverest.dev), em um único projeto Cypress.

| Alvo     | URL                          |
| -------- | ---------------------------- |
| Frontend | https://front.serverest.dev/ |
| API      | https://serverest.dev/       |

**6 cenários e 21 casos de teste**: 3 cenários de frontend e 3 de API, cada um com o caminho principal e os casos negativos que importam para a regra de negócio.

---

## Sumário

- [Cenários de teste](#cenários-de-teste)
- [Stack](#stack)
- [Arquitetura e padrões de projeto](#arquitetura-e-padrões-de-projeto)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Como executar](#como-executar)
- [Relatórios](#relatórios)
- [Integração contínua](#integração-contínua)
- [Qualidade de código e commits](#qualidade-de-código-e-commits)
- [Observações sobre a aplicação](#observações-sobre-a-aplicação)

---

## Cenários de teste

Legenda: ✅ caminho principal · ❌ caso negativo · `@smoke` caso crítico executado no smoke test.

### Frontend (E2E)

#### Cenário 1: Cadastro de usuário ([cadastro-usuario.cy.js](cypress/e2e/frontend/cadastro-usuario.cy.js))

| Caso                                                                                | Validações                                                                                            |
| ----------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| ✅ Cadastrar usuário administrador e direcioná-lo ao painel administrativo `@smoke` | Requisição `POST /usuarios` com status 201, alerta de sucesso, rota `/admin/home`, "Bem Vindo" + nome |
| ✅ Cadastrar usuário comum e direcioná-lo à loja                                    | Status 201, alerta de sucesso, rota `/home`, ausência do menu administrativo                          |
| ❌ Não cadastrar usuário com e-mail já utilizado                                    | Status 400, alerta "Este email já está sendo usado", permanece em `/cadastrarusuarios`                |

#### Cenário 2: Login ([login.cy.js](cypress/e2e/frontend/login.cy.js))

| Caso                                                                    | Validações                                                                            |
| ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| ✅ Autenticar administrador e exibir o painel administrativo `@smoke`   | Rota `/admin/home`, boas-vindas com o nome, menu administrativo, token na sessão      |
| ✅ Autenticar usuário comum e exibir a loja sem funções administrativas | Rota `/home`, busca de produtos visível, menu administrativo ausente, token na sessão |
| ❌ Não autenticar com senha incorreta                                   | Alerta "Email e/ou senha inválidos", permanece em `/login`, nenhum token gravado      |

#### Cenário 3: Cadastro de produto pelo administrador ([cadastro-produto.cy.js](cypress/e2e/frontend/cadastro-produto.cy.js))

| Caso                                                 | Validações                                                                                                                                   |
| ---------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| ✅ Cadastrar produto e exibi-lo na listagem `@smoke` | Status 201, dados persistidos no backend iguais aos do formulário, rota de listagem, linha da tabela com nome, preço, descrição e quantidade |
| ❌ Não cadastrar produto com nome já existente       | Status 400, alerta "Já existe produto com esse nome", permanece no formulário                                                                |

### API

#### Cenário 1: Cadastro de usuários ([usuarios.cy.js](cypress/e2e/api/usuarios.cy.js))

| Caso                                                             | Validações                                                                 |
| ---------------------------------------------------------------- | -------------------------------------------------------------------------- |
| ✅ Cadastrar usuário administrador e persistir os dados `@smoke` | 201, contrato, mensagem; `GET /usuarios/{id}` retorna exatamente o enviado |
| ❌ Não cadastrar com e-mail já utilizado                         | 400, contrato, mensagem; o e-mail continua associado a um único usuário    |
| ❌ Não cadastrar com dados inválidos                             | 400, contrato, mensagem específica para cada campo inválido                |

#### Cenário 2: Autenticação ([login.cy.js](cypress/e2e/api/login.cy.js))

| Caso                                                        | Validações                                                                                |
| ----------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| ✅ Autenticar e retornar um JWT do próprio usuário `@smoke` | 200, contrato `Bearer <jwt>`, payload do token com o e-mail do usuário e expiração válida |
| ❌ Não autenticar com senha incorreta _(data-driven)_       | 401, contrato, mensagem genérica                                                          |
| ❌ Não autenticar com e-mail não cadastrado _(data-driven)_ | 401 com a **mesma** mensagem, sem revelar quais e-mails existem                           |
| ❌ Não autenticar sem e-mail e senha                        | 400, mensagem para cada campo obrigatório                                                 |

#### Cenário 3: Gerenciamento de produtos ([produtos.cy.js](cypress/e2e/api/produtos.cy.js))

| Caso                                                           | Validações                                                         |
| -------------------------------------------------------------- | ------------------------------------------------------------------ |
| ✅ Cadastrar produto e disponibilizá-lo para consulta `@smoke` | 201, contrato; `GET /produtos/{id}` retorna exatamente o enviado   |
| ✅ Atualizar todos os dados de um produto                      | 200, mensagem; consulta posterior reflete a alteração              |
| ✅ Excluir um produto                                          | 200, mensagem; consulta posterior retorna "Produto não encontrado" |
| ❌ Não cadastrar produto com nome já existente                 | 400, mensagem de nome duplicado                                    |
| ❌ Não cadastrar produto sem token                             | 401, mensagem; produto não persistido                              |
| ❌ Não permitir cadastro por usuário sem perfil administrador  | 403, "Rota exclusiva para administradores"; produto não persistido |

---

## Stack

| Ferramenta                                                                              | Uso                                                            |
| --------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| [Cypress 16](https://www.cypress.io/)                                                   | Framework de testes E2E e de API                               |
| [@faker-js/faker](https://fakerjs.dev/)                                                 | Massa de dados realista (pt_BR) e única a cada execução        |
| [Ajv](https://ajv.js.org/) + ajv-formats                                                | Validação de contrato das respostas com JSON Schema            |
| [@cypress/grep](https://github.com/cypress-io/cypress/tree/develop/npm/grep)            | Execução filtrada por tags (`@smoke`, `@api`, `@frontend`...)  |
| [cypress-mochawesome-reporter](https://github.com/LironEr/cypress-mochawesome-reporter) | Relatório HTML com gráficos e screenshots das falhas embutidos |
| ESLint 10 + eslint-plugin-cypress, Prettier                                             | Padronização e boas práticas de código                         |
| Husky, lint-staged, commitlint                                                          | Lint no pre-commit e mensagens no padrão Conventional Commits  |
| GitHub Actions                                                                          | Pipeline de CI com as suítes em paralelo                       |

---

## Arquitetura e padrões de projeto

- **Page Object Model**: cada tela é uma classe em [`support/pages`](cypress/support/pages) que expõe seus elementos (`elements`) e ações de negócio (`login`, `register`). As **assertivas ficam nos specs**, para que cada teste mostre com clareza o que está sendo verificado. Componentes compartilhados, como os alertas, ficam em `pages/components`.
- **Service Object**: cada recurso da API tem um service em [`support/api/services`](cypress/support/api/services) (`UsersService`, `AuthService`, `ProductsService`) sobre um cliente HTTP único ([`api-client.js`](cypress/support/api/api-client.js)). O cliente desabilita `failOnStatusCode` porque o status é sempre validado explicitamente pelo teste, inclusive nos casos 4xx.
- **Factory**: [`UserFactory`](cypress/support/factories/user.factory.js) e [`ProductFactory`](cypress/support/factories/product.factory.js) geram dados válidos e únicos, com sobrescrita de qualquer campo (`UserFactory.admin({ email })`).
- **Testes de contrato**: JSON Schemas em [`support/api/schemas`](cypress/support/api/schemas) com `additionalProperties: false` e uma assertiva Chai customizada, legível no teste:
  ```js
  expect(response.body).to.matchSchema(SCHEMAS.user);
  ```
  Em caso de falha, a mensagem aponta o campo exato: `data/administrador must be equal to one of the allowed values`.
- **Pré-condições via API**: os testes de frontend criam usuários e produtos pela API (`cy.createUser`, `cy.createProduct`) e autenticam com `cy.loginByApi` + `cy.session` quando o login não é o objeto do teste. A UI só é exercitada no que está sendo testado, o que torna os testes mais rápidos e estáveis.
- **Testes independentes e limpeza automática**: cada teste cria a própria massa de dados. Todo recurso criado é registrado e removido num hook global ao final do spec, mesmo quando um teste falha, para não poluir a API pública. Produtos são removidos antes dos usuários, porque excluir o usuário invalida o token necessário para excluir os produtos.
- **Assertivas de rede no E2E**: `cy.intercept` confirma o status devolvido pela API à UI e captura o `_id` gerado para a limpeza. No cadastro de produto, o teste também confirma no backend que o que foi persistido é exatamente o que foi digitado.
- **Seletores estáveis**: somente `data-testid` (via `cy.getByTestId`), sem dependência de CSS ou de textos que mudam.
- **Sem esperas fixas**: nenhum `cy.wait(ms)`. A sincronização usa as asserções com retentativa do Cypress e aliases de rede.
- **Constantes centralizadas**: mensagens, status HTTP, rotas e chaves de sessão em [`support/constants`](cypress/support/constants). Uma mudança de texto na aplicação exige ajuste em um único lugar.

---

## Estrutura do projeto

```
.
├── .github/workflows/ci.yml        # Pipeline: lint → testes de API e frontend em paralelo
├── cypress/
│   ├── e2e/
│   │   ├── api/                    # Cenários de API
│   │   │   ├── login.cy.js
│   │   │   ├── produtos.cy.js
│   │   │   └── usuarios.cy.js
│   │   └── frontend/               # Cenários E2E
│   │       ├── cadastro-produto.cy.js
│   │       ├── cadastro-usuario.cy.js
│   │       └── login.cy.js
│   └── support/
│       ├── api/
│       │   ├── api-client.js       # Cliente HTTP base
│       │   ├── schemas/            # Contratos JSON Schema
│       │   └── services/           # Service Objects por recurso
│       ├── assertions/             # Assertiva customizada matchSchema
│       ├── commands/               # Comandos de massa de dados, sessão e UI
│       ├── constants/              # Mensagens, status HTTP e rotas
│       ├── factories/              # Geração de massa de dados
│       ├── pages/                  # Page Objects e componentes
│       ├── utils/                  # Utilitários (decodificação de JWT)
│       ├── e2e.js                  # Registro de plugins, comandos e limpeza global
│       └── index.d.ts              # Tipagens dos comandos customizados
├── cypress.config.js
├── eslint.config.mjs
└── commitlint.config.js
```

---

## Como executar

### Pré-requisitos

- [Node.js](https://nodejs.org/) 22 ou superior (versão de referência em [`.nvmrc`](.nvmrc))
- Google Chrome (opcional: o Electron embutido no Cypress é usado por padrão)

### Instalação

```bash
git clone https://github.com/AlexDevNavarro/cypress-serverest-qa.git
cd cypress-serverest-qa
npm ci
```

### Scripts

| Comando                 | Descrição                                        |
| ----------------------- | ------------------------------------------------ |
| `npm run cy:open`       | Abre o Cypress no modo interativo                |
| `npm test`              | Executa todos os testes em modo headless         |
| `npm run test:api`      | Executa somente os cenários de API               |
| `npm run test:frontend` | Executa somente os cenários de frontend          |
| `npm run test:smoke`    | Executa somente os casos críticos (tag `@smoke`) |
| `npm run lint`          | Analisa o código com ESLint                      |
| `npm run format`        | Formata o código com Prettier                    |

Para rodar em outro navegador ou filtrar por outra tag:

```bash
npx cypress run --browser chrome
npx cypress run --expose grepTags=@produtos
```

A URL da API fica em `expose.apiUrl` no [`cypress.config.js`](cypress.config.js) e pode ser sobrescrita sem alterar código:

```bash
npx cypress run --expose apiUrl=http://localhost:3000
```

> **VS Code:** o terminal integrado do VS Code pode definir `ELECTRON_RUN_AS_NODE=1`, o que impede o Cypress de abrir (`bad option: --no-sandbox`). Nesse caso, execute com `env -u ELECTRON_RUN_AS_NODE npm test` ou use um terminal externo.

---

## Relatórios

Após cada execução, o relatório HTML é gerado em `cypress/reports/index.html`, com gráficos, duração de cada teste e o screenshot das falhas embutido no próprio arquivo.

No CI, o relatório de cada suíte fica disponível como artefato (`relatorio-api` e `relatorio-frontend`) na página da execução, e o resumo aparece no _job summary_ do GitHub Actions.

---

## Integração contínua

O workflow [`ci.yml`](.github/workflows/ci.yml) roda em todo push na `main`, em pull requests, manualmente e diariamente em dias úteis, para detectar mudanças na aplicação pública:

1. **Lint e formatação**: ESLint e Prettier.
2. **Testes de API** e **testes de Frontend** em paralelo (matriz), no Chrome, com retentativa automática de até 2 vezes para mitigar a instabilidade de rede do ambiente público.
3. Publicação do relatório HTML e dos screenshots de falha como artefatos.

---

## Qualidade de código e commits

- **ESLint 10** (flat config) com as regras recomendadas do `eslint-plugin-cypress`, além de proibir `force: true`, `cy.pause()` e `cy.debug()`.
- **Prettier** para formatação consistente.
- **Husky + lint-staged**: lint e formatação automáticos dos arquivos alterados antes de cada commit.
- **commitlint**: mensagens no padrão [Conventional Commits](https://www.conventionalcommits.org/pt-br/) (`feat`, `test`, `ci`, `docs`, `chore`), com histórico incremental: infraestrutura, camada de suporte e um commit por cenário.

---

## Observações sobre a aplicação

Pontos encontrados durante a análise da aplicação. Não bloqueiam os testes, mas valeriam uma conversa com o time, se o ServeRest fosse um produto real:

| Tipo          | Observação                                                                                                                                                                                                            |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Segurança     | O payload do JWT retornado no login contém a **senha do usuário em texto puro**, e `GET /usuarios` também lista as senhas.                                                                                            |
| API / REST    | Recurso inexistente retorna **400** (`Usuário não encontrado` / `Produto não encontrado`) em vez de **404**. `DELETE` de recurso inexistente retorna 200 (`Nenhum registro excluído`).                                |
| Performance   | Após login ou cadastro, o frontend baixa a **lista completa de usuários** (`GET /usuarios`) para descobrir o perfil do usuário logado. No cadastro, ainda há uma espera fixa de 3 segundos antes do redirecionamento. |
| Testabilidade | O botão de cadastro de produto tem o `data-testid` com erro de digitação `cadastarProdutos`. O Page Object documenta isso para não confundir quem mantém os testes.                                                   |
