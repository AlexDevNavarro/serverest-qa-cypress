import { ProductsService } from '../../support/api';
import { SCHEMAS } from '../../support/api/schemas';
import { HTTP_STATUS } from '../../support/constants/http-status';
import { MESSAGES } from '../../support/constants/messages';
import { ProductFactory } from '../../support/factories/product.factory';

describe('API | Gerenciamento de produtos', { tags: ['@api', '@produtos'] }, () => {
  let adminToken;

  before(() => {
    cy.createUser({ administrador: 'true' })
      .then((admin) => cy.getAuthToken(admin))
      .then((token) => {
        adminToken = token;
      });
  });

  context('como administrador autenticado', () => {
    it('deve cadastrar um produto e disponibilizá-lo para consulta', { tags: '@smoke' }, () => {
      const product = ProductFactory.build();

      ProductsService.create(product, adminToken).then((createResponse) => {
        expect(createResponse.status).to.eq(HTTP_STATUS.CREATED);
        expect(createResponse.body).to.matchSchema(SCHEMAS.created);
        expect(createResponse.body.message).to.eq(MESSAGES.REGISTER_SUCCESS);

        const { _id } = createResponse.body;
        cy.trackProductForCleanup(_id, adminToken);

        ProductsService.getById(_id).then((getResponse) => {
          expect(getResponse.status).to.eq(HTTP_STATUS.OK);
          expect(getResponse.body).to.matchSchema(SCHEMAS.product);
          expect(getResponse.body).to.deep.eq({ ...product, _id });
        });
      });
    });

    it('deve atualizar todos os dados de um produto existente', () => {
      cy.createProduct(adminToken).then(({ _id }) => {
        const updatedData = ProductFactory.build();

        ProductsService.update(_id, updatedData, adminToken).then((response) => {
          expect(response.status).to.eq(HTTP_STATUS.OK);
          expect(response.body).to.matchSchema(SCHEMAS.message);
          expect(response.body.message).to.eq(MESSAGES.UPDATE_SUCCESS);
        });

        ProductsService.getById(_id)
          .its('body')
          .should('deep.eq', { ...updatedData, _id });
      });
    });

    it('deve excluir um produto existente', () => {
      cy.createProduct(adminToken).then(({ _id }) => {
        ProductsService.remove(_id, adminToken).then((response) => {
          expect(response.status).to.eq(HTTP_STATUS.OK);
          expect(response.body).to.matchSchema(SCHEMAS.message);
          expect(response.body.message).to.eq(MESSAGES.DELETE_SUCCESS);
        });

        ProductsService.getById(_id).then((response) => {
          expect(response.status).to.eq(HTTP_STATUS.BAD_REQUEST);
          expect(response.body.message).to.eq(MESSAGES.PRODUCT_NOT_FOUND);
        });
      });
    });

    it('não deve cadastrar produto com nome já existente', () => {
      cy.createProduct(adminToken).then((existingProduct) => {
        const productWithSameName = ProductFactory.build({ nome: existingProduct.nome });

        ProductsService.create(productWithSameName, adminToken).then((response) => {
          expect(response.status).to.eq(HTTP_STATUS.BAD_REQUEST);
          expect(response.body).to.matchSchema(SCHEMAS.message);
          expect(response.body.message).to.eq(MESSAGES.PRODUCT_NAME_ALREADY_IN_USE);
        });
      });
    });
  });

  context('controle de acesso', () => {
    it('não deve cadastrar produto sem token de autenticação', () => {
      const product = ProductFactory.build();

      ProductsService.create(product).then((response) => {
        expect(response.status).to.eq(HTTP_STATUS.UNAUTHORIZED);
        expect(response.body).to.matchSchema(SCHEMAS.message);
        expect(response.body.message).to.eq(MESSAGES.INVALID_TOKEN);
      });

      ProductsService.list({ nome: product.nome }).its('body.quantidade').should('eq', 0);
    });

    it('não deve permitir que usuário sem perfil administrador cadastre produto', () => {
      const product = ProductFactory.build();

      cy.createUser({ administrador: 'false' })
        .then((commonUser) => cy.getAuthToken(commonUser))
        .then((commonUserToken) => ProductsService.create(product, commonUserToken))
        .then((response) => {
          expect(response.status).to.eq(HTTP_STATUS.FORBIDDEN);
          expect(response.body).to.matchSchema(SCHEMAS.message);
          expect(response.body.message).to.eq(MESSAGES.ADMIN_ONLY_ROUTE);
        });

      ProductsService.list({ nome: product.nome }).its('body.quantidade').should('eq', 0);
    });
  });
});
