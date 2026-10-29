/** Listagem de produtos da área administrativa. */
class ProductListPage {
  elements = {
    title: () => cy.get('h1'),
    rowByProductName: (name) => cy.contains('tbody tr', name),
  };

  /**
   * Retorna o texto das colunas de dados (nome, preço, descrição e quantidade) da linha do produto.
   * @param {string} name
   * @returns {Cypress.Chainable<string[]>}
   */
  getProductRowValues(name) {
    return this.elements
      .rowByProductName(name)
      .find('td')
      .invoke('toArray')
      .invoke('slice', 0, 4)
      .invoke('map', (cell) => cell.textContent.trim());
  }
}

export default new ProductListPage();
