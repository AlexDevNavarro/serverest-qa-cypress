/// <reference types="cypress" />

interface ServeRestUser {
  _id: string;
  nome: string;
  email: string;
  password: string;
  administrador: 'true' | 'false';
}

interface ServeRestProduct {
  _id: string;
  nome: string;
  preco: number;
  descricao: string;
  quantidade: number;
}

declare namespace Cypress {
  interface Chainable {
    /** Cadastra um usuário via API (registrado para limpeza) e retorna seus dados com o `_id`. */
    createUser(overrides?: Partial<ServeRestUser>): Chainable<ServeRestUser>;

    /** Autentica via API e retorna o token no formato `Bearer <jwt>`. */
    getAuthToken(credentials: Pick<ServeRestUser, 'email' | 'password'>): Chainable<string>;

    /** Cadastra um produto via API (registrado para limpeza) e retorna seus dados com o `_id`. */
    createProduct(token: string, overrides?: Partial<ServeRestProduct>): Chainable<ServeRestProduct>;

    /** Registra um usuário criado fora dos comandos de massa para ser removido ao final do spec. */
    trackUserForCleanup(id: string): Chainable<void>;

    /** Registra um produto criado fora dos comandos de massa para ser removido ao final do spec. */
    trackProductForCleanup(id: string, token: string): Chainable<void>;

    /** Remove todos os produtos e usuários criados durante o spec. */
    cleanupTestData(): Chainable<void>;
  }
}

declare namespace Chai {
  interface Assertion {
    /** Valida o objeto contra um JSON Schema (Ajv). */
    matchSchema(schema: object): Assertion;
  }
}
