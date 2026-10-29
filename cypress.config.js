const { defineConfig } = require('cypress');
const { plugin: cypressGrepPlugin } = require('@cypress/grep/plugin');
const mochawesomeReporterPlugin = require('cypress-mochawesome-reporter/plugin');

module.exports = defineConfig({
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    reportDir: 'cypress/reports',
    reportPageTitle: 'ServeRest - Relatório de Testes',
    charts: true,
    embeddedScreenshots: true,
    inlineAssets: true,
    saveAllAttempts: false,
  },

  // Configuração pública lida nos testes via Cypress.expose().
  // Pode ser sobrescrita na linha de comando: --expose apiUrl=https://...
  expose: {
    apiUrl: 'https://serverest.dev',
  },

  e2e: {
    baseUrl: 'https://front.serverest.dev',
    specPattern: 'cypress/e2e/**/*.cy.js',
    supportFile: 'cypress/support/e2e.js',
    viewportWidth: 1366,
    viewportHeight: 768,
    // A aplicação e a API são públicas e compartilhadas: os tempos de resposta variam.
    defaultCommandTimeout: 10000,
    requestTimeout: 15000,
    responseTimeout: 30000,
    video: false,
    screenshotOnRunFailure: true,
    retries: {
      runMode: 2,
      openMode: 0,
    },
    setupNodeEvents(on, config) {
      mochawesomeReporterPlugin(on);
      cypressGrepPlugin(config);
      return config;
    },
  },
});
