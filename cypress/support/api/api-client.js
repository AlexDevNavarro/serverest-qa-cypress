/**
 * Cliente HTTP base da API ServeRest, compartilhado por todos os services.
 *
 * `failOnStatusCode` fica desabilitado porque o status da resposta faz parte do
 * que é validado: os testes negativos precisam receber 4xx sem que o Cypress falhe antes da assertiva.
 *
 * @param {object} options
 * @param {'GET'|'POST'|'PUT'|'DELETE'} [options.method]
 * @param {string} options.path endpoint relativo à apiUrl, ex.: '/usuarios'
 * @param {object} [options.body]
 * @param {object} [options.qs] query string
 * @param {string} [options.token] valor do header Authorization ('Bearer ...')
 * @returns {Cypress.Chainable<Cypress.Response<any>>}
 */
export const apiRequest = ({ method = 'GET', path, body, qs, token }) => {
  const headers = token ? { Authorization: token } : {};

  return cy.request({
    method,
    url: `${Cypress.expose('apiUrl')}${path}`,
    body,
    qs,
    headers,
    failOnStatusCode: false,
  });
};
