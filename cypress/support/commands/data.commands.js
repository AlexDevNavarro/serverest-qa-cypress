import { AuthService, ProductsService, UsersService } from '../api';
import { HTTP_STATUS } from '../constants/http-status';
import { ProductFactory } from '../factories/product.factory';
import { UserFactory } from '../factories/user.factory';

// Massa de dados criada via API. Os expects abaixo são só pré-condição:
// se a API estiver fora, o teste falha aqui com uma mensagem clara.

// Fica no support file para ser compartilhado com o hook de limpeza do e2e.js.
const createdResources = { products: [], users: [] };

Cypress.Commands.add('trackUserForCleanup', (id) => {
  createdResources.users.push(id);
});

Cypress.Commands.add('trackProductForCleanup', (id, token) => {
  createdResources.products.push({ id, token });
});

Cypress.Commands.add('createUser', (overrides = {}) => {
  const user = UserFactory.build(overrides);

  return UsersService.create(user).then((response) => {
    expect(response.status, 'pré-condição: cadastro do usuário via API').to.eq(HTTP_STATUS.CREATED);

    cy.trackUserForCleanup(response.body._id);
    return cy.wrap({ ...user, _id: response.body._id }, { log: false });
  });
});

Cypress.Commands.add('getAuthToken', ({ email, password }) => {
  return AuthService.login({ email, password }).then((response) => {
    expect(response.status, 'pré-condição: login via API').to.eq(HTTP_STATUS.OK);
    return response.body.authorization;
  });
});

Cypress.Commands.add('createProduct', (token, overrides = {}) => {
  const product = ProductFactory.build(overrides);

  return ProductsService.create(product, token).then((response) => {
    expect(response.status, 'pré-condição: cadastro do produto via API').to.eq(HTTP_STATUS.CREATED);

    cy.trackProductForCleanup(response.body._id, token);
    return cy.wrap({ ...product, _id: response.body._id }, { log: false });
  });
});

// Produtos saem antes dos usuários: depois que o admin é excluído, o token dele
// deixa de valer e os produtos não podem mais ser removidos com ele.
// Erro na limpeza não derruba o teste.
Cypress.Commands.add('cleanupTestData', () => {
  const products = createdResources.products.splice(0);
  const users = createdResources.users.splice(0);

  products.forEach(({ id, token }) => ProductsService.remove(id, token));
  users.forEach((id) => UsersService.remove(id));
});
