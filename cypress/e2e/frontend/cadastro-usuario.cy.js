import { FRONT_ROUTES } from '../../support/constants/routes';
import { HTTP_STATUS } from '../../support/constants/http-status';
import { MESSAGES } from '../../support/constants/messages';
import { UserFactory } from '../../support/factories/user.factory';
import AdminHomePage from '../../support/pages/admin-home.page';
import HomePage from '../../support/pages/home.page';
import SignupPage from '../../support/pages/signup.page';

describe('Frontend | Cadastro de usuário', { tags: ['@frontend', '@cadastro'] }, () => {
  beforeEach(() => {
    cy.intercept('POST', `${Cypress.expose('apiUrl')}/usuarios`).as('createUser');
    SignupPage.visit();
  });

  /** Garante que a UI enviou o cadastro e registra o usuário criado para limpeza. */
  const waitForUserCreation = () => {
    cy.wait('@createUser').then(({ response }) => {
      expect(response.statusCode).to.eq(HTTP_STATUS.CREATED);
      cy.trackUserForCleanup(response.body._id);
    });
  };

  it(
    'deve cadastrar um usuário administrador e direcioná-lo ao painel administrativo',
    { tags: '@smoke' },
    () => {
      const admin = UserFactory.admin();

      SignupPage.register(admin);

      waitForUserCreation();
      SignupPage.elements
        .successAlert()
        .should('be.visible')
        .and('contain.text', MESSAGES.REGISTER_SUCCESS);
      cy.location('pathname').should('eq', FRONT_ROUTES.ADMIN_HOME);
      AdminHomePage.elements
        .welcomeTitle()
        .should('contain.text', 'Bem Vindo')
        .and('contain.text', admin.nome);
    },
  );

  it('deve cadastrar um usuário comum e direcioná-lo à loja', () => {
    const customer = UserFactory.common();

    SignupPage.register(customer);

    waitForUserCreation();
    SignupPage.elements
      .successAlert()
      .should('be.visible')
      .and('contain.text', MESSAGES.REGISTER_SUCCESS);
    cy.location('pathname').should('eq', FRONT_ROUTES.HOME);
    HomePage.elements.title().should('contain.text', 'Serverest Store');
    HomePage.elements.adminProductRegisterLink().should('not.exist');
  });

  it('não deve cadastrar usuário com e-mail já utilizado', () => {
    cy.createUser().then((existingUser) => {
      SignupPage.register(UserFactory.build({ email: existingUser.email }));
    });

    cy.wait('@createUser').its('response.statusCode').should('eq', HTTP_STATUS.BAD_REQUEST);
    SignupPage.elements
      .errorAlert()
      .should('be.visible')
      .and('contain.text', MESSAGES.EMAIL_ALREADY_IN_USE);
    cy.location('pathname').should('eq', FRONT_ROUTES.SIGNUP);
  });
});
