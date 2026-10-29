/**
 * Alertas exibidos pelo frontend: o de sucesso (azul) e os de erro (cinza),
 * que trazem a mensagem retornada pela API.
 */
export const AlertComponent = {
  success: () => cy.get('.alert-primary'),
  error: () => cy.get('.alert-secondary'),
};
