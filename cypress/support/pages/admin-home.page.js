/** Painel inicial do administrador. */
class AdminHomePage {
  elements = {
    welcomeTitle: () => cy.get('h1'),
    productRegisterLink: () => cy.getByTestId('cadastrar-produtos'),
  };
}

export default new AdminHomePage();
