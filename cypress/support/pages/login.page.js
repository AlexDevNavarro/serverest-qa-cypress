import { FRONT_ROUTES } from '../constants/routes';
import { AlertComponent } from './components/alert.component';

class LoginPage {
  elements = {
    emailInput: () => cy.getByTestId('email'),
    passwordInput: () => cy.getByTestId('senha'),
    submitButton: () => cy.getByTestId('entrar'),
    errorAlert: AlertComponent.error,
  };

  visit() {
    cy.visit(FRONT_ROUTES.LOGIN);
    return this;
  }

  login({ email, password }) {
    this.elements.emailInput().type(email);
    this.elements.passwordInput().type(password, { log: false });
    this.elements.submitButton().click();
    return this;
  }
}

export default new LoginPage();
