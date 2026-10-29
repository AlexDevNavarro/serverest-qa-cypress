import { FRONT_ROUTES } from '../constants/routes';
import { AlertComponent } from './components/alert.component';

class ProductRegistrationPage {
  elements = {
    nameInput: () => cy.getByTestId('nome'),
    priceInput: () => cy.getByTestId('preco'),
    descriptionInput: () => cy.getByTestId('descricao'),
    quantityInput: () => cy.getByTestId('quantity'),
    // O data-testid do botão é "cadastarProdutos" (sic) na aplicação.
    submitButton: () => cy.getByTestId('cadastarProdutos'),
    errorAlert: AlertComponent.error,
  };

  visit() {
    cy.visit(FRONT_ROUTES.ADMIN_PRODUCT_REGISTER);
    return this;
  }

  /** @param {{nome: string, preco: number, descricao: string, quantidade: number}} product */
  register({ nome, preco, descricao, quantidade }) {
    this.elements.nameInput().type(nome);
    this.elements.priceInput().type(`${preco}`);
    this.elements.descriptionInput().type(descricao);
    this.elements.quantityInput().type(`${quantidade}`);
    this.elements.submitButton().click();
    return this;
  }
}

export default new ProductRegistrationPage();
