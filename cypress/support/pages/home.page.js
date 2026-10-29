/** Página inicial da loja, exibida para usuários sem perfil administrador. */
class HomePage {
  elements = {
    title: () => cy.get('h1'),
    searchInput: () => cy.getByTestId('pesquisar'),
    adminProductRegisterLink: () => cy.getByTestId('cadastrar-produtos'),
  };
}

export default new HomePage();
