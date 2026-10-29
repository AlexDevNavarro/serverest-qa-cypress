import 'cypress-mochawesome-reporter/register';
import { register as registerCypressGrep } from '@cypress/grep';

import './assertions/json-schema.assertion';
import './commands/data.commands';

registerCypressGrep();

// Limpa a massa de dados criada pelo spec, mesmo quando algum teste falha.
after(() => {
  cy.cleanupTestData();
});
