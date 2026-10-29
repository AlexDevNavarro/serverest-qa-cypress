import { ProductsService } from '../../support/api';
import { FRONT_ROUTES } from '../../support/constants/routes';
import { HTTP_STATUS } from '../../support/constants/http-status';
import { MESSAGES, UI_TEXTS } from '../../support/constants/messages';
import { ProductFactory } from '../../support/factories/product.factory';
import ProductListPage from '../../support/pages/product-list.page';
import ProductRegistrationPage from '../../support/pages/product-registration.page';

describe(
  'Frontend | Cadastro de produto pelo administrador',
  { tags: ['@frontend', '@produtos'] },
  () => {
    let admin;
    let adminToken;

    before(() => {
      cy.createUser({ administrador: 'true' })
        .then((user) => {
          admin = user;
          return cy.getAuthToken(user);
        })
        .then((token) => {
          adminToken = token;
        });
    });

    beforeEach(() => {
      cy.loginByApi(admin);
      cy.intercept('POST', `${Cypress.expose('apiUrl')}/produtos`).as('createProduct');
      ProductRegistrationPage.visit();
    });

    it('deve cadastrar um produto e exibi-lo na listagem de produtos', { tags: '@smoke' }, () => {
      const product = ProductFactory.build();

      ProductRegistrationPage.register(product);

      cy.wait('@createProduct').then(({ response }) => {
        expect(response.statusCode).to.eq(HTTP_STATUS.CREATED);

        const { _id } = response.body;
        cy.trackProductForCleanup(_id, adminToken);

        // Confirma que o backend persistiu exatamente o que foi preenchido no formulário.
        ProductsService.getById(_id)
          .its('body')
          .should('deep.eq', { ...product, _id });
      });

      cy.location('pathname').should('eq', FRONT_ROUTES.ADMIN_PRODUCT_LIST);
      ProductListPage.elements.title().should('have.text', UI_TEXTS.PRODUCT_LIST_TITLE);
      ProductListPage.getProductRowValues(product.nome).should('deep.eq', [
        product.nome,
        `${product.preco}`,
        product.descricao,
        `${product.quantidade}`,
      ]);
    });

    it('não deve cadastrar produto com nome já existente', () => {
      cy.createProduct(adminToken).then((existingProduct) => {
        ProductRegistrationPage.register(ProductFactory.build({ nome: existingProduct.nome }));
      });

      cy.wait('@createProduct').its('response.statusCode').should('eq', HTTP_STATUS.BAD_REQUEST);
      ProductRegistrationPage.elements
        .errorAlert()
        .should('be.visible')
        .and('contain.text', MESSAGES.PRODUCT_NAME_ALREADY_IN_USE);
      cy.location('pathname').should('eq', FRONT_ROUTES.ADMIN_PRODUCT_REGISTER);
    });
  },
);
