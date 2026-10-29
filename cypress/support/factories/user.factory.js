import { fakerPT_BR as faker } from '@faker-js/faker';

const EMAIL_DOMAIN = 'qa-cypress.com';

/**
 * Gera um e-mail único por execução. A API é pública e compartilhada,
 * então o timestamp evita colisão com dados de outras execuções.
 */
const uniqueEmail = (firstName, lastName) => {
  const username = faker.internet
    .username({ firstName, lastName })
    .toLowerCase()
    .replace(/[^a-z0-9._]/g, '');
  return `${username}.${Date.now()}${faker.string.numeric(3)}@${EMAIL_DOMAIN}`;
};

/** Senha alfanumérica: evita caracteres que o cy.type() interpreta como teclas especiais. */
const password = () => faker.internet.password({ length: 12, pattern: /[A-Za-z0-9]/ });

/**
 * Factory de usuários no formato aceito pelo endpoint POST /usuarios.
 * Qualquer campo pode ser sobrescrito para montar cenários específicos.
 */
export const UserFactory = {
  build(overrides = {}) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();

    return {
      nome: `${firstName} ${lastName}`,
      email: uniqueEmail(firstName, lastName),
      password: password(),
      administrador: 'false',
      ...overrides,
    };
  },

  admin(overrides = {}) {
    return this.build({ administrador: 'true', ...overrides });
  },

  common(overrides = {}) {
    return this.build({ administrador: 'false', ...overrides });
  },
};
