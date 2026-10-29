import { FRONT_ROUTES } from '../constants/routes';
import { AlertComponent } from './components/alert.component';

class SignupPage {
  elements = {
    nameInput: () => cy.getByTestId('nome'),
    emailInput: () => cy.getByTestId('email'),
    passwordInput: () => cy.getByTestId('password'),
    adminCheckbox: () => cy.getByTestId('checkbox'),
    submitButton: () => cy.getByTestId('cadastrar'),
    successAlert: AlertComponent.success,
    errorAlert: AlertComponent.error,
  };

  visit() {
    cy.visit(FRONT_ROUTES.SIGNUP);
    return this;
  }

  /** @param {{nome: string, email: string, password: string, administrador: 'true'|'false'}} user */
  register({ nome, email, password, administrador }) {
    this.elements.nameInput().type(nome);
    this.elements.emailInput().type(email);
    this.elements.passwordInput().type(password, { log: false });

    if (administrador === 'true') {
      this.elements.adminCheckbox().check();
    }

    this.elements.submitButton().click();
    return this;
  }
}

export default new SignupPage();
