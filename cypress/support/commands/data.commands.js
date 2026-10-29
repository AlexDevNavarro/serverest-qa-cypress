import { AuthService, ProductsService, UsersService } from '../api';
import { HTTP_STATUS } from '../constants/http-status';
import { ProductFactory } from '../factories/product.factory';
import { UserFactory } from '../factories/user.factory';

/**
 * Comandos de preparação de massa de dados via API.
 *
 * Os pré-requisitos dos testes são criados pela API (mais rápido e estável que pela UI),
 * e todo recurso criado é registrado para limpeza automática ao final do spec.
 * As verificações aqui são guardas de pré-condição: falham cedo e com mensagem clara
 * caso o ambiente esteja indisponível, em vez de deixar o teste quebrar em outro ponto.
 */

// Registro dos recursos criados durante o spec. Fica no bundle do support file,
// que é compartilhado por todos os comandos e pelo hook global de limpeza.
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

/**
 * Remove tudo o que foi criado durante o spec. Produtos são removidos antes dos
 * usuários porque a exclusão exige o token do administrador que os cadastrou.
 * Falhas aqui não quebram o teste: a limpeza é "best effort".
 */
Cypress.Commands.add('cleanupTestData', () => {
  const products = createdResources.products.splice(0);
  const users = createdResources.users.splice(0);

  products.forEach(({ id, token }) => ProductsService.remove(id, token));
  users.forEach((id) => UsersService.remove(id));
});
