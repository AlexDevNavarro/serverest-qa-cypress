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
      .then(($cells) => Cypress._.map($cells.slice(0, 4), (cell) => cell.textContent.trim()));
  }
}

export default new ProductListPage();
