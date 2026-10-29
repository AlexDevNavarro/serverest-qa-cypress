import { FRONT_ROUTES, STORAGE_KEYS } from '../../support/constants/routes';
import { MESSAGES } from '../../support/constants/messages';
import AdminHomePage from '../../support/pages/admin-home.page';
import HomePage from '../../support/pages/home.page';
import LoginPage from '../../support/pages/login.page';

const getStoredToken = () =>
  cy.window().then((win) => win.localStorage.getItem(STORAGE_KEYS.TOKEN));

describe('Frontend | Login', { tags: ['@frontend', '@login'] }, () => {
  let admin;
  let customer;

  before(() => {
    cy.createUser({ administrador: 'true' }).then((user) => {
      admin = user;
    });
    cy.createUser({ administrador: 'false' }).then((user) => {
      customer = user;
    });
  });

  beforeEach(() => {
    LoginPage.visit();
  });

  it('deve autenticar o administrador e exibir o painel administrativo', { tags: '@smoke' }, () => {
    LoginPage.login(admin);

    cy.location('pathname').should('eq', FRONT_ROUTES.ADMIN_HOME);
    AdminHomePage.elements
      .welcomeTitle()
      .should('contain.text', 'Bem Vindo')
      .and('contain.text', admin.nome);
    AdminHomePage.elements.productRegisterLink().should('be.visible');
    getStoredToken().should('match', /^Bearer .+/);
  });

  it('deve autenticar o usuário comum e exibir a loja sem acesso às funções administrativas', () => {
    LoginPage.login(customer);

    cy.location('pathname').should('eq', FRONT_ROUTES.HOME);
    HomePage.elements.title().should('contain.text', 'Serverest Store');
    HomePage.elements.searchInput().should('be.visible');
    HomePage.elements.adminProductRegisterLink().should('not.exist');
    getStoredToken().should('match', /^Bearer .+/);
  });

  it('não deve autenticar com senha incorreta', () => {
    LoginPage.login({ email: admin.email, password: 'SenhaIncorreta123' });

    LoginPage.elements
      .errorAlert()
      .should('be.visible')
      .and('contain.text', MESSAGES.INVALID_CREDENTIALS);
    cy.location('pathname').should('eq', FRONT_ROUTES.LOGIN);
    getStoredToken().should('be.null');
  });
});
