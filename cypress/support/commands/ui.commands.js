import { STORAGE_KEYS } from '../constants/routes';

Cypress.Commands.add('getByTestId', (testId, options) => {
  return cy.get(`[data-testid="${testId}"]`, options);
});

/**
 * Autentica pela API e grava a sessão no localStorage, como o frontend faz após o login.
 * Usado quando o login não é o objeto do teste: evita repetir o fluxo de UI e
 * o cy.session reaproveita a sessão entre os testes do mesmo spec.
 */
Cypress.Commands.add('loginByApi', (user) => {
  cy.session(
    ['loginByApi', user.email],
    () => {
      cy.getAuthToken(user).then((token) => {
        window.localStorage.setItem(STORAGE_KEYS.TOKEN, token);
        window.localStorage.setItem(STORAGE_KEYS.EMAIL, user.email);
        window.localStorage.setItem(STORAGE_KEYS.NAME, user.nome);
      });
    },
    {
      validate() {
        expect(window.localStorage.getItem(STORAGE_KEYS.TOKEN)).to.match(/^Bearer /);
      },
    },
  );
});
