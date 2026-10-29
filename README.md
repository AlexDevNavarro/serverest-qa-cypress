# ServeRest - Automação de Testes com Cypress

[![CI](https://github.com/AlexDevNavarro/cypress-serverest-qa/actions/workflows/ci.yml/badge.svg)](https://github.com/AlexDevNavarro/cypress-serverest-qa/actions/workflows/ci.yml)

Testes E2E do frontend e testes de API do [ServeRest](https://serverest.dev), feitos com Cypress em um único projeto.

- Frontend: https://front.serverest.dev/
- API: https://serverest.dev/

São 3 cenários de frontend e 3 de API, com 21 casos de teste no total. Cada cenário tem o fluxo principal e os casos negativos ligados à regra de negócio.

## Cenários

Os casos marcados com `@smoke` são os que rodam no `npm run test:smoke`.

### Frontend

**1. Cadastro de usuário** ([cadastro-usuario.cy.js](cypress/e2e/frontend/cadastro-usuario.cy.js))

| Tipo     | Caso                                                             | O que é validado                                                                      |
| -------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| Positivo | Cadastrar administrador e cair no painel administrativo `@smoke` | `POST /usuarios` com 201, alerta de sucesso, rota `/admin/home` e nome no "Bem Vindo" |
| Positivo | Cadastrar usuário comum e cair na loja                           | 201, alerta de sucesso, rota `/home` e menu de admin ausente                          |
| Negativo | Cadastrar com e-mail que já existe                               | 400, alerta "Este email já está sendo usado" e usuário continua na tela de cadastro   |

**2. Login** ([login.cy.js](cypress/e2e/frontend/login.cy.js))

| Tipo     | Caso                            | O que é validado                                                         |
| -------- | ------------------------------- | ------------------------------------------------------------------------ |
| Positivo | Login de administrador `@smoke` | Rota `/admin/home`, nome no "Bem Vindo", menu de admin e token na sessão |
| Positivo | Login de usuário comum          | Rota `/home`, campo de busca, menu de admin ausente e token na sessão    |
| Negativo | Login com senha errada          | Alerta "Email e/ou senha inválidos", continua em `/login` e sem token    |

**3. Cadastro de produto pelo administrador** ([cadastro-produto.cy.js](cypress/e2e/frontend/cadastro-produto.cy.js))

| Tipo     | Caso                                         | O que é validado                                                                                       |
| -------- | -------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Positivo | Cadastrar produto e ver na listagem `@smoke` | 201, produto salvo no backend igual ao que foi digitado, nome, preço, descrição e quantidade na tabela |
| Negativo | Cadastrar produto com nome repetido          | 400, alerta "Já existe produto com esse nome" e continua no formulário                                 |

### API

**1. Cadastro de usuários** ([usuarios.cy.js](cypress/e2e/api/usuarios.cy.js))

| Tipo     | Caso                               | O que é validado                                                           |
| -------- | ---------------------------------- | -------------------------------------------------------------------------- |
| Positivo | Cadastrar administrador `@smoke`   | 201, contrato e mensagem; o `GET /usuarios/{id}` devolve o que foi enviado |
| Negativo | Cadastrar com e-mail que já existe | 400, contrato e mensagem; continua existindo um só usuário com o e-mail    |
| Negativo | Cadastrar com dados inválidos      | 400 e a mensagem de erro de cada campo                                     |

**2. Login** ([login.cy.js](cypress/e2e/api/login.cy.js))

| Tipo     | Caso                                   | O que é validado                                                          |
| -------- | -------------------------------------- | ------------------------------------------------------------------------- |
| Positivo | Login com credenciais válidas `@smoke` | 200, contrato, token `Bearer` cujo payload tem o e-mail do usuário        |
| Negativo | Senha errada                           | 401 e mensagem genérica                                                   |
| Negativo | E-mail não cadastrado                  | 401 com a mesma mensagem da senha errada (não revela e-mails cadastrados) |
| Negativo | E-mail e senha em branco               | 400 e mensagem de cada campo obrigatório                                  |

Os dois casos de credencial inválida são o mesmo teste rodando com dados diferentes.

**3. Produtos** ([produtos.cy.js](cypress/e2e/api/produtos.cy.js))

| Tipo     | Caso                                          | O que é validado                                                  |
| -------- | --------------------------------------------- | ----------------------------------------------------------------- |
| Positivo | Cadastrar produto `@smoke`                    | 201, contrato; o `GET /produtos/{id}` devolve o que foi enviado   |
| Positivo | Editar produto                                | 200 e a consulta seguinte já traz os dados novos                  |
| Positivo | Excluir produto                               | 200 e a consulta seguinte retorna "Produto não encontrado"        |
| Negativo | Cadastrar com nome repetido                   | 400 e mensagem de nome duplicado                                  |
| Negativo | Cadastrar sem token                           | 401 e o produto não é salvo                                       |
| Negativo | Cadastrar com usuário que não é administrador | 403 "Rota exclusiva para administradores" e o produto não é salvo |

## Bibliotecas

| Biblioteca                                                                              | Para quê                                                        |
| --------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| [Cypress 16](https://www.cypress.io/)                                                   | Testes de frontend e de API                                     |
| [@faker-js/faker](https://fakerjs.dev/)                                                 | Gerar dados de teste em pt_BR, diferentes a cada execução       |
| [Ajv](https://ajv.js.org/) e ajv-formats                                                | Validar o contrato das respostas com JSON Schema                |
| [@cypress/grep](https://github.com/cypress-io/cypress/tree/develop/npm/grep)            | Rodar testes por tag (`@smoke`, `@api`, `@frontend`, etc.)      |
| [cypress-mochawesome-reporter](https://github.com/LironEr/cypress-mochawesome-reporter) | Relatório HTML com os screenshots das falhas                    |
| ESLint, eslint-plugin-cypress e Prettier                                                | Padrão de código                                                |
| Husky, lint-staged e commitlint                                                         | Lint antes do commit e mensagens no padrão Conventional Commits |

## Como o projeto está organizado

```
cypress/
├── e2e/
│   ├── api/             # cenários de API
│   └── frontend/        # cenários de frontend
└── support/
    ├── api/
    │   ├── api-client.js
    │   ├── schemas/     # JSON Schemas das respostas
    │   └── services/    # um service por recurso da API
    ├── assertions/      # assertiva matchSchema
    ├── commands/        # massa de dados, sessão e getByTestId
    ├── constants/       # mensagens, status HTTP e rotas
    ├── factories/       # geração de usuários e produtos
    ├── pages/           # Page Objects
    ├── utils/
    └── e2e.js
```

Algumas decisões:

- **Page Objects**: cada tela tem uma classe em `support/pages` com os elementos e as ações (`login`, `register`). As assertivas ficam nos specs, assim dá para ler o teste e saber o que ele verifica sem abrir outro arquivo.
- **Services da API**: `UsersService`, `AuthService` e `ProductsService` usam o mesmo `api-client.js`. O `failOnStatusCode` fica desligado porque os testes negativos precisam receber o 4xx e validar.
- **Factories**: `UserFactory` e `ProductFactory` geram dados válidos e permitem sobrescrever qualquer campo, por exemplo `UserFactory.build({ email })`.
- **Contrato**: os schemas usam `additionalProperties: false`, então um campo novo ou faltando na resposta quebra o teste. A assertiva fica assim:
  ```js
  expect(response.body).to.matchSchema(SCHEMAS.user);
  ```
- **Pré-condições pela API**: nos testes de frontend, usuários e produtos são criados pela API (`cy.createUser`, `cy.createProduct`). No cenário de produto o login também é feito pela API com `cy.session`, porque ali o login não é o que está sendo testado.
- **Limpeza**: tudo o que os testes criam é apagado no fim de cada spec, mesmo se algum teste falhar. Os produtos são apagados antes dos usuários, porque quando o admin é excluído o token dele deixa de valer.
- **Intercept no frontend**: o `cy.intercept` confere o status que a API devolveu para a tela e pega o `_id` do que foi criado.
- **Seletores**: só `data-testid`, pelo comando `cy.getByTestId`.
- **Sem `cy.wait` com tempo fixo**: a espera é feita pelas próprias assertivas do Cypress e pelos aliases de rede.

## Como rodar

Precisa de Node.js 22, 24 ou 26+ (as versões suportadas pelo Cypress 16; o `.nvmrc` aponta a usada no projeto).

```bash
git clone https://github.com/AlexDevNavarro/cypress-serverest-qa.git
cd cypress-serverest-qa
npm ci
```

| Comando                 | O que faz                         |
| ----------------------- | --------------------------------- |
| `npm run cy:open`       | Abre o Cypress no modo interativo |
| `npm test`              | Roda todos os testes              |
| `npm run test:api`      | Roda só os testes de API          |
| `npm run test:frontend` | Roda só os testes de frontend     |
| `npm run test:smoke`    | Roda só os casos `@smoke`         |
| `npm run lint`          | ESLint                            |
| `npm run format`        | Prettier                          |

Outros exemplos:

```bash
npx cypress run --browser chrome
npx cypress run --expose grepTags=@produtos
npx cypress run --expose apiUrl=http://localhost:3000
```

Se o Cypress não abrir pelo terminal do VS Code com o erro `bad option: --no-sandbox`, é a variável `ELECTRON_RUN_AS_NODE` que o VS Code define. Dá para rodar com `env -u ELECTRON_RUN_AS_NODE npm test` ou usar outro terminal.

O relatório fica em `cypress/reports/index.html` depois de cada execução.

## CI

O [workflow](.github/workflows/ci.yml) roda a cada push na `main`, em pull requests, manualmente e uma vez por dia em dias úteis. Primeiro passa o lint e o Prettier; depois os testes de API e de frontend rodam em paralelo no Chrome. Os relatórios ficam como artefato na página da execução e os screenshots são anexados quando algum teste falha.

Como a aplicação é pública e às vezes oscila, o Cypress tenta de novo até 2 vezes um teste que falhar no CI.

## O que encontrei na aplicação

Durante a análise apareceram alguns pontos que não impedem os testes, mas que eu levaria para o time se fosse um produto real:

- **Segurança**: o token JWT do login carrega a senha do usuário em texto puro no payload, e o `GET /usuarios` também devolve as senhas.
- **API**: buscar um usuário ou produto que não existe retorna 400 em vez de 404. Excluir um registro que não existe retorna 200 com "Nenhum registro excluído".
- **Performance**: depois do login ou do cadastro, o frontend baixa a lista inteira de usuários (`GET /usuarios`) só para descobrir se quem entrou é admin. No cadastro ainda tem uma espera fixa de 3 segundos antes de redirecionar.
- **Testabilidade**: o botão de cadastrar produto tem `data-testid="cadastarProdutos"`, faltando o "r".
